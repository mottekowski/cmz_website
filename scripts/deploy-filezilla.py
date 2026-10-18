"""Deploy this site over verified FTPS, with local backup/rollback.

Credentials are read only from the explicitly selected FileZilla entry and kept
in memory. No passwords, usernames or credential XML are logged or copied.
Default is a read-only plan; transfer requires --upload.
"""
import argparse
import base64
import ftplib
import hashlib
import io
import json
import os
from pathlib import Path
import ssl
import urllib.error
import urllib.request
import uuid
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
URL = 'https://curiouscurrent.xyz'
HOST = 'wp1163914.server-he.de'
SITE_NAME = 'CmZ Website'
REMOTE_ROOT = ''


def digest(data):
    return hashlib.sha256(data).hexdigest()


def fetch(path):
    request = urllib.request.Request(URL + path, headers={'User-Agent': 'CmZ-Deployment-Check/1.0', 'Cache-Control': 'no-cache'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read(), dict(response.headers)


def read_remote(ftp, path):
    result = io.BytesIO()
    ftp.retrbinary('RETR ' + remote_path(path), result.write)
    return result.getvalue()


def remote_path(path):
    return '/' + '/'.join(part for part in [REMOTE_ROOT.strip('/'), path.lstrip('/')] if part)


def list_files(ftp, directory=''):
    files = set()
    # Inspect only directories receiving this build, not unrelated hosting data.
    for name, facts in ftp.mlsd(remote_path(directory)):
        if facts.get('type') == 'file':
            files.add('/'.join(part for part in [directory.strip('/'), name] if part))
    return files


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--upload', action='store_true')
    parser.add_argument('--inspect-remote-root', action='store_true', help='List remote directories without changing files')
    args = parser.parse_args()
    dist = ROOT / 'dist'
    files = sorted(p for p in dist.rglob('*') if p.is_file())
    if not files or not (dist / 'index.html').exists():
        raise RuntimeError('Run the static build before deployment')
    payload = {p.relative_to(dist).as_posix(): p.read_bytes() for p in files}
    if b'content="index, follow"' not in payload['index.html']:
        raise RuntimeError('Homepage must permit indexing')
    if payload.get('robots.txt', b'').find(b'Allow: /') == -1:
        raise RuntimeError('robots.txt must allow crawling')
    if b'X-Robots-Tag' in payload.get('.htaccess', b''):
        raise RuntimeError('Apache configuration must not send an X-Robots-Tag')

    xml_path = Path(os.environ['APPDATA']) / 'FileZilla' / 'sitemanager.xml'
    servers = [server for server in ET.parse(xml_path).findall('.//Server') if server.findtext('Name') == SITE_NAME]
    if len(servers) != 1:
        raise RuntimeError('Expected exactly one selected FileZilla site')
    server = servers[0]
    if server.findtext('Host') != HOST or server.findtext('Port') != '21' or server.findtext('Protocol') != '0':
        raise RuntimeError('FileZilla target changed; inspect before deployment')
    if server.findtext('RemoteDir') not in (None, '', REMOTE_ROOT):
        raise RuntimeError(f'Unexpected FileZilla remote directory; only {REMOTE_ROOT} is permitted for this deployment')
    if server.find('Pass').get('encoding') != 'base64':
        raise RuntimeError('Unsupported password encoding; no credentials were printed')

    ftp = ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=30)
    ftp.connect(HOST, 21)
    ftp.login(server.findtext('User'), base64.b64decode(server.findtext('Pass')).decode('utf-8'))
    ftp.prot_p()
    if args.inspect_remote_root:
        directories = sorted(name for name, facts in ftp.mlsd('/') if facts.get('type') == 'dir')
        print(json.dumps({'mode': 'inspect-remote-root', 'site': SITE_NAME, 'directories': directories}, ensure_ascii=False))
        ftp.quit()
        return
    old_index = read_remote(ftp, 'index.html')
    web_index, _ = fetch('/')
    if old_index != web_index:
        raise RuntimeError('FTP target does not match the website root')

    directories = sorted({str(Path(name).parent).replace('\\', '/') for name in payload} - {'.'})
    existing = list_files(ftp)
    existing_dirs = {name for name, facts in ftp.mlsd(REMOTE_ROOT) if facts.get('type') == 'dir'}
    for directory in directories:
        if '/' in directory:
            raise RuntimeError('Unexpected nested output directory; inspect build')
        if directory in existing_dirs:
            existing |= list_files(ftp, directory)
    overwritten = [name for name in payload if name in existing]
    print(json.dumps({'mode': 'upload' if args.upload else 'read-only-plan', 'site': SITE_NAME, 'host': HOST, 'remote_root': REMOTE_ROOT, 'tls_verified': True, 'domain_mapping_verified': True, 'files': len(payload), 'bytes': sum(map(len, payload.values())), 'overwrites': overwritten, 'new_directories': [d for d in directories if d not in existing_dirs]}, ensure_ascii=False))
    if not args.upload:
        ftp.quit()
        return

    deployment_id = uuid.uuid4().hex
    backup = ROOT / '.qa' / 'deployments' / deployment_id
    backup.mkdir(parents=True)
    for name in overwritten:
        destination = backup / 'previous' / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(read_remote(ftp, name))
    manifest = {'id': deployment_id, 'url': URL, 'overwritten': overwritten, 'files': {name: digest(data) for name, data in payload.items()}, 'status': 'backed-up'}
    report = backup / 'manifest.json'
    report.write_text(json.dumps(manifest, indent=2), encoding='utf-8')

    # Assets and secondary pages first, homepage next, redirects/headers last.
    order = sorted(payload, key=lambda name: (2 if name == '.htaccess' else 1 if name == 'index.html' else 0, name))
    changed = []
    temporary = None
    try:
        for directory in directories:
            if directory not in existing_dirs:
                ftp.mkd(remote_path(directory))
        for name in order:
            temporary = name + '.upload-' + deployment_id
            ftp.storbinary('STOR ' + remote_path(temporary), io.BytesIO(payload[name]))
            if read_remote(ftp, temporary) != payload[name]:
                raise RuntimeError('Uploaded bytes failed verification')
            ftp.rename(remote_path(temporary), remote_path(name))
            temporary = None
            changed.append(name)
        for name, expected in payload.items():
            if read_remote(ftp, name) != expected:
                raise RuntimeError('Remote file differs from build: ' + name)
            if name != '.htaccess':
                actual, headers = fetch('/' + name)
                if actual != expected:
                    raise RuntimeError('HTTPS file differs from build: ' + name)
                if 'noindex' in headers.get('X-Robots-Tag', '').lower():
                    raise RuntimeError('Live HTTP response still blocks indexing')
        actual_home, _ = fetch('/')
        if actual_home != payload['index.html']:
            raise RuntimeError('Homepage handover failed')
        for route in ['/impressum/', '/datenschutz/']:
            actual, _ = fetch(route)
            if actual != payload[route.strip('/') + '/index.html']:
                raise RuntimeError('Directory route failed')
        try:
            fetch('/cmz-deployment-missing-' + deployment_id)
            raise RuntimeError('Unknown URL did not return 404')
        except urllib.error.HTTPError as error:
            if error.code != 404 or error.read() != payload['404.html']:
                raise RuntimeError('Custom 404 page failed') from None
        for url in ['https://curiouscurrent.xyz/']:
            with urllib.request.urlopen(url, timeout=30) as response:
                if response.url != url or response.read() != payload['index.html']:
                    raise RuntimeError('HTTPS hostname was unexpectedly redirected')
        manifest['status'] = 'verified'
        print(json.dumps({'result': 'verified', 'url': URL + '/', 'files_verified_over_ftps': len(payload), 'public_files_verified_over_https': len(payload) - 1, 'backup': str(backup.relative_to(ROOT))}))
    except Exception:
        # Restore only paths touched by this transaction. Unrelated files stay intact.
        rollback_errors = []
        if temporary:
            try:
                ftp.delete(remote_path(temporary))
            except ftplib.all_errors:
                pass
        for name in reversed(changed):
            try:
                if name in overwritten:
                    ftp.storbinary('STOR ' + remote_path(name), io.BytesIO((backup / 'previous' / name).read_bytes()))
                else:
                    ftp.delete(remote_path(name))
            except ftplib.all_errors:
                rollback_errors.append(name)
        manifest['status'] = 'rollback-incomplete' if rollback_errors else 'rolled-back'
        manifest['rollback_errors'] = rollback_errors
        raise
    finally:
        report.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
        ftp.close()


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        # Never emit credential-bearing tracebacks or local XML contents.
        print(json.dumps({'error': type(error).__name__, 'message': str(error)[:200]}))
        raise SystemExit(1)

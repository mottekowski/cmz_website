# Deployment — öffentlicher Entwurf

## Status der Domainmigration am 18.10.2026

Der Websiteinhaber hat ausdrücklich bestätigt: **„Entwurf trotzdem öffentlich hochladen“**, einschließlich sichtbarer Entwurfskennzeichnung und gesperrter Indexierung trotz offener Rechtsangaben.

Der nächste Upload ist ausschließlich für **https://curiouscurrent.xyz/** vorgesehen. Er bleibt ausgesetzt, bis das Zertifikat für diesen Host über IPv4 und IPv6 ohne `SEC_E_WRONG_PRINCIPAL` ausgeliefert wird. Dies ist keine Freigabe einer fertigen Produktionsfassung. `publicationApproved: false` und `indexable: false` bleiben unverändert.

## Ziel und Übertragung

- FileZilla-Site: **CmZ Website** (the saved profile is FTPS on
  port 21, with explicit TLS).
- Host: `wp1163914.server-he.de`, Port 21, FTP mit explizitem TLS; Zertifikatprüfung aktiv, Datenkanal ebenfalls verschlüsselt.
- Ausschließliches FTP-Ziel: `/wwwcmz`. `/wwwcmz2` darf weder beschrieben noch gelöscht werden.
- Nur die 24 Dateien aus `dist/` wurden übertragen. Referenzbilder, Quellcode, Prüfberichte, Zugangsdaten und lokale Arbeitsdateien gehören nicht zum Upload.
- Vorhandene Startseite vor dem Ersetzen gesichert. Andere bestehende Dateien und Verzeichnisse wurden nicht gelöscht.
- Assets und Unterseiten zuerst, Startseite danach, Apache-Konfiguration zuletzt. Jede Datei wurde zunächst unter temporärem Namen übertragen, gelesen und verglichen, dann umbenannt.
- Zugangsdaten werden ausschließlich aus dem gewählten lokalen FileZilla-Eintrag gelesen. Sie stehen weder im Repository noch in Argumenten, Berichten oder Ausgaben.

## Serververhalten

`public/.htaccess` wird mit dem Build ausgeliefert und konfiguriert:

- Ausschließlich `http://curiouscurrent.xyz` wird auf
  `https://curiouscurrent.xyz` weitergeleitet. Es gibt keine Regel für die
  alte Domain oder `www`-Hostnamen.
- Eigene statische 404-Seite mit korrektem HTTP-Status 404.
- `X-Robots-Tag: noindex, nofollow`, zusätzlich zu den vorhandenen Meta-Tags, `robots.txt` und der leeren Sitemap.
- `X-Content-Type-Options: nosniff` und `Referrer-Policy: strict-origin-when-cross-origin`.

Die Indexierungssperre ist **keine Zugangskontrolle**. Die Seite ist entsprechend der ausdrücklichen Entscheidung öffentlich abrufbar.

## Verifikation

- Astro-/TypeScript-Prüfung, ESLint, Build und Prüfung von 63 lokalen Link-/Asset-Verweisen erfolgreich.
- Alle 24 übertragenen Dateien über FTPS bytegenau gegen den lokalen Build geprüft.
- Alle 23 öffentlich abrufbaren Dateien zusätzlich über HTTPS bytegenau geprüft; `.htaccess` wird nicht als öffentliche Datei abgerufen.
- Startseite, Impressum-/Datenschutz-Verzeichnisrouten, HTTPS-/www-Weiterleitungen, individuelle Fehlerseite und HTTP-Indexierungssperre geprüft.
- Browserchecks gegen die Live-Adresse erfolgreich: sieben Breiten von 320 bis 1440 px, drei unbeschnittene Hero-Zeilen, Navigation, Reduced Motion, Betrieb ohne JavaScript und Rechtsseiten. Keine gemeldeten axe-Verstöße, Browserfehler oder externen Ressourcenanfragen. Bericht und Live-Screenshots liegen lokal unter `.qa/live-deployment-review/`. Die ursprünglichen Designreview-Screenshots unter `review/2026-10-15/` bleiben unverändert.

## Backup und Rückweg

Das Backup dieses ersten Uploads liegt lokal unter:

```text
.qa/deployments/e9895be909b04adebfcdbc6b1ffa58ca/
  previous/index.html
  manifest.json
```

Das Manifest enthält die übertragenen Pfade und SHA-256-Prüfsummen, keine Zugangsdaten. Es ist zusammen mit dem Backup durch `.gitignore` von Git ausgeschlossen. Vor einer Wiederherstellung zuerst sicherstellen, dass keine zwischenzeitlichen Serveränderungen überschrieben würden. Die vorherige Startseite kann mit demselben FileZilla-Eintrag aus `previous/index.html` wiederhergestellt werden. Nur nach Prüfung dürfen zusätzlich die im Manifest aufgeführten, neu angelegten Dateien entfernt werden; fremde Serverdateien bleiben erhalten.

## Private Rechtstexte im Build

Die Betreiber- und Hostingangaben stammen jetzt aus **privaten Build-Umgebungsvariablen** (siehe [PRIVATE_LEGAL_DATA.md](PRIVATE_LEGAL_DATA.md)). Das öffentliche Repository speichert keine persönliche Anschrift und keine Impressums-E-Mail. **Beim späteren statischen Build** werden die Werte in `dist/impressum/index.html` und `dist/datenschutz/index.html` geschrieben; erst die Übertragung dieser Build-Dateien bringt sie auf den Webserver. Kein Upload der privaten Umgebungsdatei. Ein regulärer `pnpm build`-Lauf ohne Prozessvariablen erzeugt weiterhin ausdrücklich unvollständige Entwurfsseiten.

Die bereits öffentlich erreichbaren Entwurfsseiten bleiben bis zu einem ausdrücklich freigegebenen neuen Upload unverändert. Die Veröffentlichung von echten Impressumsdaten im fertigen HTML ist rechtlich zu erwarten und zu beabsichtigen, aber **nicht in der Git-Historie**.

## Weiterer Upload

Voraussetzungen: aktueller erfolgreicher Build und Checks; lokale FileZilla-Konfiguration mit genau dem geprüften Eintrag. Python-Standardbibliothek genügt.

```sh
python scripts/deploy-filezilla.py
```

Ohne Flag erfolgt nur ein lesender Plan einschließlich Domain-Zuordnungsprüfung. Erst mit ausdrücklicher Freigabe des jeweiligen öffentlichen Entwurfs:

```sh
python scripts/deploy-filezilla.py --upload-public-draft
```

Das Skript akzeptiert ausschließlich einen Build mit aktiven Indexierungssperren. Es sichert zu ersetzende Dateien und versucht bei einem Fehler, die von diesem Upload berührten Pfade zurückzusetzen. Backups unter `.qa/deployments/` aufbewahren.

Für Live-Browserchecks ohne Überschreiben der Designabnahme-Dateien:

```powershell
$env:PREVIEW_URL = 'https://curiouscurrent.xyz'
$env:REVIEW_DIR = '.qa/live-deployment-review'
node scripts/check-browser.mjs
```

## Vor einem finalen Release

Rechts- und Hostingangaben müssen durch den Inhaber vervollständigt und geprüft werden. Der FTP-Hostname allein ersetzt keine bestätigten Angaben zum Hosting-Vertrag, Standort oder zur Verarbeitung von Serverprotokollen. Entwurfskennzeichnungen dürfen erst nach dieser Prüfung entfallen. Für die spätere Indexierung müssen sowohl die Website-Konfiguration als auch der Entwurfsheader in `.htaccess` bewusst geändert werden. `pnpm check:release` bleibt bis zur tatsächlichen finalen Freigabe gesperrt.

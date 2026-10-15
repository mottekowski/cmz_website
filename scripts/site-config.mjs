import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

export async function readSiteConfig() {
  const source = stripTypeScriptTypes(await readFile(new URL('../src/config/site.ts', import.meta.url), 'utf8'));
  return (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).site;
}

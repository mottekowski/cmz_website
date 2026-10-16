import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

/** Build-time only. This ignored file must never be copied into public output. */
export function loadPrivateEnv() {
  const path = new URL('../.env.private', import.meta.url);
  if (existsSync(path)) loadEnvFile(path);
}

import { defineConfig } from 'astro/config';
import { loadPrivateEnv } from './scripts/private-env.mjs';

loadPrivateEnv();

export default defineConfig({
  site: 'https://curiouscurrent.xyz',
  output: 'static',
  devToolbar: { enabled: false },
});

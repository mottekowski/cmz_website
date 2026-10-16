import { defineConfig } from 'astro/config';
import { loadPrivateEnv } from './scripts/private-env.mjs';

loadPrivateEnv();

export default defineConfig({
  site: 'https://www.christoph-zink.de',
  output: 'static',
  devToolbar: { enabled: false },
});

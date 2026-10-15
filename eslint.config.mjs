import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', '.qa/**'] },
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
];

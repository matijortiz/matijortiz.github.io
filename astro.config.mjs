import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://matijortiz.github.io',
  output: 'static',
  build: {
    assets: 'assets'
  }
});

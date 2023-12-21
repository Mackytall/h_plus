/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, BuildOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { UserConfig } from 'vitest';
import eslint from 'vite-plugin-eslint';
//import { VitePWA } from 'vite-plugin-pwa';

const test: UserConfig = {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
  coverage: {
    reporter: ['text', 'json', 'html'],
  },
};

const build: BuildOptions = {
  sourcemap: false,
  commonjsOptions: {
    sourceMap: false,
  },
  minify: true,
};

// const pwa = VitePWA({
//   registerType: 'autoUpdate',
//   includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
//   manifest: {
//     name: 'Al Andalous',
//     short_name: 'Al Andalous',
//     description:
//       'Association qui a pour but de promouvoir la culture musulmane et le bien vivre-ensemble, qui propose aussi des activités de loisirs pour tout âge.',
//     theme_color: '#4F4F4F',
//     icons: [
//       {
//         src: 'pwa-192x192.png',
//         sizes: '192x192',
//         type: 'image/png',
//       },
//       {
//         src: 'pwa-512x512.png',
//         sizes: '512x512',
//         type: 'image/png',
//       },
//     ],
//   },
// });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  test,
  build,
});

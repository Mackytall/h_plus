import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    globalSetup: ['./mongo-memory-server.ts'],
    threads: false,
    exclude: ['build', 'node_modules'],
  },
});

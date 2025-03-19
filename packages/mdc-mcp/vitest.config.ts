import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      all: true,
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules',
        'dist',
        'build',
        'public',
        'types',
        '**/*.test.{ts,tsx}',
        'src/cli.ts',
      ],
    },
  },
});

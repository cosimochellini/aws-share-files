import { defineConfig } from 'vitest/config';

export default defineConfig({
  // tsconfig.json sets "jsx": "preserve" for the Next compiler, which esbuild would
  // honour by leaving JSX untransformed. src/instances/navbar.tsx is inside the
  // coverage scope, so the transform has to be forced on here.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/utils/**',
        'src/classes/**',
        'src/services/**',
        'src/formatters/**',
        'src/store/**',
        'src/hooks/**',
        'src/instances/**',
        'src/fallback/**',
        'pages/api/**',
      ],
      exclude: ['**/*.d.ts', 'src/types/**'],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
});

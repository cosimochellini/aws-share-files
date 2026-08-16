import { defineConfig } from 'vitest/config';

// No JSX override here: Next 16 sets tsconfig's "jsx" to "react-jsx", and Vite reads it
// from there. Putting "preserve" back would leave JSX untransformed and break
// src/instances/navbar.tsx, which is inside the coverage scope.
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    // restoreMocks keeps vi.spyOn calls from leaking between tests, which is what
    // stops one spec's stubbed Storage.prototype.setItem or Date.now from silently
    // changing the meaning of the next. As of Vitest 4 it only touches vi.spyOn, so
    // implementations declared inside vi.mock factories now survive on their own.
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

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
    // restoreMocks keeps vi.spyOn calls from leaking between tests, which is what
    // stops one spec's stubbed Storage.prototype.setItem or Date.now from silently
    // changing the meaning of the next. Note it also strips the implementations
    // declared inside vi.mock factories, so tests/setup.ts re-arms the nodemailer
    // transport in a beforeEach rather than only in the factory.
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

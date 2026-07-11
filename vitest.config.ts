import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts', 'scripts/**/*.{test,spec}.ts'],
    exclude: ['node_modules', '.next', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Gate on product logic only (not Next pages / scripts)
      include: ['src/lib/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/**',
        '**/*.d.ts',
        '**/*.{test,spec}.ts',
        '**/types.ts',
        '**/job-types.ts', // schema-only
        '**/mcp-transcript.ts', // I/O helper
      ],
      thresholds: {
        lines: 55,
        functions: 55,
        branches: 50,
        statements: 55,
      },
    },
  },
});

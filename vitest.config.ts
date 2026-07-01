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
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
      // basic thresholds per scaffolding plan; focus on core lib paths
      // full 80% targeted in future iterations per non-goals
      exclude: [
        'node_modules/**',
        '.next/**',
        'scripts/verify-*.ts', // keep as integration drivers for now
        '**/*.d.ts',
        '**/types.ts',
      ],
    },
  },
});

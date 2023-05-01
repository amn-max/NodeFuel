// vitest.config.unit.ts

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./src/tests/**/*.test.ts"],
  },
  resolve: {},
});

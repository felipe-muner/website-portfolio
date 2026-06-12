import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // New rules introduced by react-hooks v6 (eslint-config-next 16).
      // Existing code predates them — keep as warnings so CI stays green.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
    },
  },
  // Override default ignores of eslint-config-next. `next lint` (removed in
  // Next 16) only covered app/components/lib/src — keep that scope.
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "tests/**",
    "scripts/**",
    "drizzle/**",
    "jest.config.js",
    "jest.setup.js",
  ]),
]);

export default eslintConfig;

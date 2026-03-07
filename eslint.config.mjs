import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Downgrade noisy type-safety rules to warnings — fixing all `any`
      // types across the codebase is a separate refactor task.
      "@typescript-eslint/no-explicit-any": "warn",

      // JSX unescaped entities are safe and cosmetic — downgrade to warn.
      "react/no-unescaped-entities": "warn",

      // Unused vars are warnings by default; keep them that way.
      "@typescript-eslint/no-unused-vars": "warn",

      // Unused expressions (e.g. `user && fn()` pattern) — warn only.
      "@typescript-eslint/no-unused-expressions": "warn",

      // Next.js image optimisation advice — warn, not block.
      "@next/next/no-img-element": "warn",

      // prefer-const is a code style preference — downgrade to warn.
      "prefer-const": "warn",

      // react-hooks rules — keep exhaustive-deps as warn (common in real apps).
      "react-hooks/exhaustive-deps": "warn",

      // purity / setState-in-effect — warn, not error.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",

      // Keep these as errors — they represent real bugs or Next.js violations:
      // "@next/next/no-html-link-for-pages": "error"  (already default)
    },
  },
]);

export default eslintConfig;

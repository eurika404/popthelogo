// ESLint 9 flat config using typescript-eslint.
// Next.js 16's build already type-checks the project; this config adds lint
// rules on top without depending on the legacy eslint-config-next bridge.

import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "supabase/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "prefer-const": "warn",
      eqeqeq: ["warn", "smart"],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },
  {
    // ESLint should not parse type-only declaration files as modules.
    files: ["**/*.d.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
);

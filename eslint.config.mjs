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
    // src/registry/default is a verbatim copy of the markdown-graphs shadcn
    // registry, kept unmodified so it can be re-synced from upstream. Two of
    // its files trip React Compiler's newer rules (a clock that seeds state in
    // an effect, a running total accumulated in a map). Relaxed here rather
    // than patched, so the copy stays faithful.
    files: ["src/registry/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;

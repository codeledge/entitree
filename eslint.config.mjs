import globals from "globals";
import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "public/**", "scripts/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.recommended,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}", "test/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
    settings: { react: { version: "detect" } },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      // pre-existing unused imports/vars; keep visible without failing CI
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      "jsx-a11y/no-autofocus": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  prettier,
);

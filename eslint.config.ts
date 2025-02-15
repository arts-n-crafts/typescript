import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'indent': ['error', 2],
      '@stylistic/indent': ['error', 2],
    }
  },
  {files: ["src/**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.node }},
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_[^_].*$|^_$",
          "varsIgnorePattern": "^_[^_].*$|^_$",
          "caughtErrorsIgnorePattern": "^_[^_].*$|^_$"
        }
      ]
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

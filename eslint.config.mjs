import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js, "@typescript-eslint": tsPlugin },
    extends: ["js/recommended"], 
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
    // env: {
    //   browser: true,
    //   node: true,
    //   es2021: true,
    //   commonjs: true,
    // },
    rules: {
      ...tsPlugin.configs.recommended.rules, 
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": ["error", { typeof: true }],
    },
  },

  // Vue plugin recommended config (flat style)
  pluginVue.configs["flat/essential"],

  // Vue files use tsParser inside script blocks
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
]);

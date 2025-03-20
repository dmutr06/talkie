import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {files: ["**/*.{js,mjs,cjs,ts}"]},
    {
        languageOptions: { globals: globals.node },
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            "@stylistic/semi": "error",
            "@stylistic/indent": ["error", 4],
            "@stylistic/quotes": ["error", "double"],
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];

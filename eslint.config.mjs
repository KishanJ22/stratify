import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import recommendedConfig from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";

export default [
    eslintConfigPrettier,
    recommendedConfig,
    eslint.configs.recommended,
    ...tseslint.configs.stylistic,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        plugins: {
            import: importPlugin,
            react,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-require-imports": "warn",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "no-unused-vars": "off",
            "prettier/prettier": "warn",
            "import/extensions": [
                "error",
                "ignorePackages",
                {
                    js: "always",
                    ts: "never",
                    tsx: "never",
                    jsx: "never",
                },
            ],
        },
    },
];

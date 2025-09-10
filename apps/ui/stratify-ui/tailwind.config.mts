import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class", // Enables .dark class for dark mode
    content: ["./app/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: "var(--card)",
                "card-foreground": "var(--card-foreground)",
                border: "var(--border)",
                input: "var(--input)",
                sidebar: "var(--sidebar)",
                "sidebar-foreground": "var(--sidebar-foreground)",
                "sidebar-border": "var(--sidebar-border)",

                primary: {
                    lightest: "var(--primary-lightest)",
                    lighter: "var(--primary-lighter)",
                    light: "var(--primary-light)",
                    base: "var(--primary-base)",
                    dark: "var(--primary-dark)",
                    darker: "var(--primary-darker)",
                    darkest: "var(--primary-darkest)",
                },
                secondary: {
                    lightest: "var(--secondary-lightest)",
                    lighter: "var(--secondary-lighter)",
                    light: "var(--secondary-light)",
                    base: "var(--secondary-base)",
                    dark: "var(--secondary-dark)",
                    darker: "var(--secondary-darker)",
                    darkest: "var(--secondary-darkest)",
                },
                accent: {
                    lightest: "var(--accent-lightest)",
                    lighter: "var(--accent-lighter)",
                    light: "var(--accent-light)",
                    base: "var(--accent-base)",
                    dark: "var(--accent-dark)",
                    darker: "var(--accent-darker)",
                    darkest: "var(--accent-darkest)",
                },
                negative: {
                    lightest: "var(--negative-lightest)",
                    lighter: "var(--negative-lighter)",
                    light: "var(--negative-light)",
                    base: "var(--negative-base)",
                    dark: "var(--negative-dark)",
                    darker: "var(--negative-darker)",
                    darkest: "var(--negative-darkest)",
                },
                positive: {
                    lightest: "var(--positive-lightest)",
                    lighter: "var(--positive-lighter)",
                    light: "var(--positive-light)",
                    base: "var(--positive-base)",
                    dark: "var(--positive-dark)",
                    darker: "var(--positive-darker)",
                    darkest: "var(--positive-darkest)",
                },
                muted: {
                    lightest: "var(--muted-lightest)",
                    lighter: "var(--muted-lighter)",
                    light: "var(--muted-light)",
                    base: "var(--muted-base)",
                    dark: "var(--muted-dark)",
                    darker: "var(--muted-darker)",
                    darkest: "var(--muted-darkest)",
                },
            },
            fontFamily: {
                sans: ["Commissioner", "sans-serif"],
                serif: ["Kaisei Decol", "serif"],
                mono: ["Source Code Pro", "monospace"],
            },
        },
    },
    plugins: [],
};

export default config;

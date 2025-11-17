import type { Config } from "tailwindcss";

const config = {
    darkMode: "class", // Enables .dark class for dark mode
    content: ["./app/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: {
                    light: "var(--background-light)",
                    dark: "var(--background-dark)",
                },
                foreground: {
                    light: "var(--foreground-light)",
                    dark: "var(--foreground-dark)",
                },
                card: {
                    light: "var(--card-light)",
                    dark: "var(--card-dark)",
                    foreground: {
                        light: "var(--card-foreground-light)",
                        dark: "var(--card-foreground-dark)",
                    },
                },
                border: {
                    light: "var(--border-light)",
                    dark: "var(--border-dark)",
                },
                input: {
                    light: "var(--input-light)",
                    dark: "var(--input-dark)",
                },
                // sidebar: "var(--sidebar)",
                sidebar: {
                    light: "var(--sidebar-light)",
                    dark: "var(--sidebar-dark)",
                    foreground: {
                        light: "var(--sidebar-foreground-light)",
                        dark: "var(--sidebar-foreground-dark)",
                    },
                    border: {
                        light: "var(--sidebar-border-light)",
                        dark: "var(--sidebar-border-dark)",
                    },
                },
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
} satisfies Config;

export default config;

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react(), tsconfigPaths(), vanillaExtractPlugin()],
    test: {
        css: true,
        environment: "jsdom",
        globals: true,
        setupFiles: "app/tests/setup.tsx",
        coverage: {
            provider: "istanbul",
            reporter: [
                ["html"],
                ["text"],
                ["lcov", { projectRoot: "../../.." }],
            ],
            include: ["app/**/*.{ts,tsx,js,jsx}"],
            exclude: [
                ...coverageConfigDefaults.exclude,
                "app/components/ui/**/*",
                "app/api/**/*",
            ],
        },
        server: {
            deps: {
                inline: true,
            },
        },
    },
});

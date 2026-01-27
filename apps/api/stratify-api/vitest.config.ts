import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: "src/tests/setup.ts",
        coverage: {
            enabled: true,
            provider: "istanbul",
            reporter: ["html", ["lcov", { projectRoot: "../../.." }], "text"],
            reportOnFailure: true,
            include: ["src/**/*.ts"],
            exclude: [
                "src/__mocks__",
                "src/config.ts",
                "**/types",
                "**/types/**",
                "**/services/**",
                "src/generate-openapi-spec.ts",
                "src/database/**",
                "src/app.ts",
                "src/lib/**",
                "src/utils/**",
                "src/routes/auth.ts",
                "src/tests/**",
            ],
        },
        fileParallelism: false,
        reporters: ["default"],
        server: {
            deps: {
                inline: ["@fastify/autoload"],
            },
        },
    },
});

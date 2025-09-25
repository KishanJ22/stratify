import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: "istanbul",
            reporter: ["html", "lcov", "text"],
            include: ["src/**/*.ts"],
            exclude: [
                "src/__mocks__",
                "src/config.ts",
                "src/index.ts",
                "**/types",
                "**/types/**",
                "**/services/**",
                "src/openai/**",
                "src/generate-openapi-spec.ts",
                "src/database/**",
                "src/app.ts",
            ],
        },
        reporters: ["default"],
        server: {
            deps: {
                inline: ["@fastify/autoload"],
            },
        },
    },
});

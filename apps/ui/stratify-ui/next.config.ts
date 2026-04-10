import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { join } from "path";

const nextConfig: NextConfig = {
    transpilePackages: ["@stratify/stratify-ui"],
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    turbopack: {
        root: join(__dirname, "../../.."),
    },
};

// Required for building Docker images for use in production
if (process.env.ENVIRONMENT !== "local") nextConfig.output = "standalone";

const nextIntlPlugin = createNextIntlPlugin("./lib/i18n-request.ts");

export default nextIntlPlugin(nextConfig);

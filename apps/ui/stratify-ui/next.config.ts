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
    }
};

export default nextConfig;

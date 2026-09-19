import { join } from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	transpilePackages: ["@stratify/stratify-ui"],
	reactCompiler: true,
	experimental: {
		turbopackFileSystemCacheForDev: true,
	},
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

const nextIntlPlugin = createNextIntlPlugin({
	requestConfig: "./i18n/request.ts",
	experimental: {
		createMessagesDeclaration: "./messages/en/messages.json",
	},
});

export default nextIntlPlugin(nextConfig);

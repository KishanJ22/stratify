# Stratify monorepo
This is the monorepo for Stratify, a next-generation investment management portal. It contains the following applications in the `apps` directory:
- `stratify-api` - The Core API for Stratify, built with Fastify and Kysely.
- `stratify-data-api` - The Data API for retrieving current asset details, built with FastAPI and yfinance.
- `stratify-ui` - The frontend for Stratify, built with NextJS and Tailwind CSS.

## Getting Started
To get started with Stratify, follow these steps:
1. Install Node.js, pnpm, Python and uv on your machine.
2. Install the dependencies for all apps with `pnpm install` or `pnpm i`.
3. Create a `.env` file in the directory of each app with the necessary environment variables. Refer to teh `.env.template` files in each app directory for the required variables.
4. Start the apps in dev mode from the root directory with `pnpm dev`, which will start all apps at the same time.
5. Build the apps from the root directory by running `pnpm build`.
6. Start the apps in production mode from the root directory with `pnpm start`, which will start all apps at the same time. 
7. Run tests for all apps from the root directory with `pnpm test`.
8. Run tests with coverage for all apps from the root directory with `pnpm test:coverage`.
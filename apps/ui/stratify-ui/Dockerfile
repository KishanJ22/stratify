ARG NODE_VERSION=26.9.0
ARG PNPM_VERSION=12.4.2
ARG TURBO_VERSION=2.10.5

FROM node:${NODE_VERSION}-alpine3.24 AS base
RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

RUN apk add --no-cache libc6-compat

FROM base AS builder-base
RUN npm install -g turbo@${TURBO_VERSION}
WORKDIR /app
COPY . .

FROM builder-base AS builder
RUN turbo prune @stratify/stratify-ui --docker

# Install dependencies required for running the app
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ . 

RUN pnpm i --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Required as stratify-api is listed as a dependency in the package.json for the UI
COPY apps/api/stratify-data-api/docs/openapi.json apps/api/stratify-data-api/docs/openapi.json

RUN pnpm build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/ui/stratify-ui/next.config.ts ./apps/ui/stratify-ui/next.config.ts
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui/stratify-ui/package.json ./apps/ui/stratify-ui/package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui/stratify-ui/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui/stratify-ui/.next/static ./apps/ui/stratify-ui/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/ui/stratify-ui/public ./apps/ui/stratify-ui/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/ui/stratify-ui/server.js"]
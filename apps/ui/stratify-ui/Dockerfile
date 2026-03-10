ARG NODE_VERSION=25.2.1
FROM node:${NODE_VERSION}-alpine3.23 AS base

RUN npm install -g pnpm turbo && \
    apk update && \
    apk add libc6-compat --no-cache

FROM base AS builder-base
WORKDIR /app
COPY . .

FROM builder-base AS builder
RUN turbo prune @stratify/stratify-ui --docker

# Install dependencies required for running the app
FROM base AS installer
RUN apk update && apk add libc6-compat --no-cache
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ . 

RUN pnpm i --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_API_PROXY_URL
ENV NEXT_PUBLIC_API_PROXY_URL=${NEXT_PUBLIC_API_PROXY_URL}

ARG NEXT_PUBLIC_AUTH_PROXY_URL
ENV NEXT_PUBLIC_AUTH_PROXY_URL=${NEXT_PUBLIC_AUTH_PROXY_URL}

# Required as stratify-api is listed as a dependency in the package.json for the UI
COPY apps/api/stratify-data-api/docs/openapi.json apps/api/stratify-data-api/docs/openapi.json

RUN pnpm build

FROM base AS runner
WORKDIR /app

ARG STRATIFY_API_URL
ENV STRATIFY_API_URL=${STRATIFY_API_URL}

ARG STRATIFY_AUTH_URL
ENV STRATIFY_AUTH_URL=${STRATIFY_AUTH_URL}

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
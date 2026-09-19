ARG NODE_VERSION=26.9.0
ARG PNPM_VERSION=12.4.2

FROM node:${NODE_VERSION}-alpine3.24 AS base
RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# Build the app with all dependencies
FROM base AS builder
WORKDIR /app
USER root

# Copy required files for building the app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/stratify-api apps/api/stratify-api

# Copy openapi specification for python data api so that the types can be generated for the api client
COPY apps/api/stratify-data-api/docs/openapi.json apps/api/stratify-data-api/docs/openapi.json

# Install all dependencies for the app and build it for deployment
RUN pnpm install --frozen-lockfile --filter=@stratify/stratify-api
RUN pnpm build --filter=@stratify/stratify-api
RUN pnpm --filter=@stratify/stratify-api --prod deploy builder --legacy

# Set permissions for node user to access the app files
RUN chown -R node:root /app
USER node

FROM base AS runner
USER root
ENV APP_DIR=/home/node/stratify-api
WORKDIR ${APP_DIR}

# Set permissions for node user to access the app files
RUN chgrp -R 0 ${APP_DIR} && \
    chmod -R g+rwx ${APP_DIR}
USER node

# Copy the built app (including its production node_modules) from the builder stage
COPY --chown=node:root --from=builder /app/builder ./

# Expose a port and run the app
EXPOSE 3000
CMD ["node", "dist/app.js"]
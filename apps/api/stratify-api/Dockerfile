ARG NODE_VERSION=25.2.1
FROM node:${NODE_VERSION}-alpine3.23 AS base
RUN npm install -g pnpm

# Install dependencies required for running the app
FROM base AS prod-deps
WORKDIR /app

# Copy pnpm and package.json files to install the production deps only for the stratify-api app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/stratify-api/package.json apps/api/stratify-api/

RUN pnpm install --prod --frozen-lockfile --filter=@stratify/stratify-api

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

# Copy the installed production dependencies and the built app from previous stages
COPY --chown=node:root --from=prod-deps /app/node_modules ./node_modules
COPY --chown=node:root --from=builder /app/builder ./

# Expose a port and run the app
EXPOSE 3000
CMD ["node", "dist/app.js"]
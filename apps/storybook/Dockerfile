FROM node:24-alpine AS builder
RUN corepack enable
WORKDIR /app

# Copy lockfile and package manifests first for layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc* ./
COPY apps/storybook/package.json apps/storybook/
COPY packages/config/package.json packages/config/
COPY packages/datum-ui/package.json packages/datum-ui/
COPY packages/shadcn/package.json packages/shadcn/
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build datum-ui first (storybook depends on its dist for CSS and types)
RUN pnpm --filter @datum-cloud/datum-ui build

# Build storybook
RUN pnpm --filter @repo/storybook build

FROM joseluisq/static-web-server:2-alpine
COPY --from=builder /app/apps/storybook/storybook-static /public
COPY apps/storybook/sws.toml /etc/sws/config.toml
ENV SERVER_CONFIG_FILE=/etc/sws/config.toml

# Run as non-root user (sws default user)
USER 1000
EXPOSE 8080

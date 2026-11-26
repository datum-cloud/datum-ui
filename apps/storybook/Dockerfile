FROM node:26.13.1-alpine AS builder
WORKDIR /app

# Copy lockfile and package manifests first for layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/storybook/package.json apps/storybook/
COPY packages/assistant-core/package.json packages/assistant-core/
COPY packages/config/package.json packages/config/
COPY packages/datum-ui/package.json packages/datum-ui/
COPY packages/shadcn/package.json packages/shadcn/
# Install the pnpm release package.json pins. The split drops a `+sha512.`
# suffix, which npm can't parse. Scripts stay off: allowBuilds covers local
# installs only, and the Storybook build needs none of them.
RUN npm install -g "$(node -p 'require("./package.json").packageManager.split("+")[0]')" --no-audit --no-fund && \
    pnpm install --frozen-lockfile --prod=false --ignore-scripts

# Copy source
COPY . .

RUN pnpm --filter "@repo/storybook..." build

FROM joseluisq/static-web-server:2-alpine
COPY --from=builder /app/apps/storybook/storybook-static /public
COPY apps/storybook/sws.toml /etc/sws/config.toml
ENV SERVER_CONFIG_FILE=/etc/sws/config.toml

USER root
RUN apk add --no-cache --upgrade 'ca-certificates>=20261020-r0'
RUN ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBrMQswCQYDVQQG /etc/ssl/certs/ca-certificates.crt

# Run as non-root user (sws default user)
USER 1000
EXPOSE 8080

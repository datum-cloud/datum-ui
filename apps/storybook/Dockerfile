FROM node:24-alpine AS builder
RUN corepack enable
WORKDIR /app

# Copy lockfile and package manifests first for layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc* ./
COPY apps/storybook/package.json apps/storybook/
COPY packages/assistant-core/package.json packages/assistant-core/
COPY packages/config/package.json packages/config/
COPY packages/datum-ui/package.json packages/datum-ui/
COPY packages/shadcn/package.json packages/shadcn/
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

RUN pnpm --filter "@repo/storybook..." build

FROM joseluisq/static-web-server:2-alpine
COPY --from=builder /app/apps/storybook/storybook-static /public
COPY apps/storybook/sws.toml /etc/sws/config.toml
ENV SERVER_CONFIG_FILE=/etc/sws/config.toml

USER root
RUN set -e; f=/etc/ssl/certs/ca-certificates.crt; m=MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBrMQswCQYDVQQG; n=$(grep -c 'BEGIN CERTIFICATE' "$f"); awk -v m="$m" '/-----BEGIN CERTIFICATE-----/{b=""; c=1} c{b=b $0 "\n"} !c{print} /-----END CERTIFICATE-----/{if (index(b, m)==0) printf "%s", b; c=0}' "$f" > "$f.new"; test "$(grep -c 'BEGIN CERTIFICATE' "$f.new")" -eq "$((n-1))"; mv "$f.new" "$f"; rm -f /usr/share/ca-certificates/mozilla/emSign_ECC_Root_CA_-_G3.crt

# Run as non-root user (sws default user)
USER 1000
EXPOSE 8080

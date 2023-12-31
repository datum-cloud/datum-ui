FROM oven/bun AS install
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN bun install
RUN bun run build

FROM install
ENV NODE_ENV=production
COPY --from=install . .
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]
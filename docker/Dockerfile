########################
# Base Builder
########################
FROM node:22-alpine AS base

WORKDIR /app

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Install dependencies
RUN apk add --no-cache libc6-compat make g++ py3-pip linux-headers \
    && npm install -g corepack@0.31.0 \
    && corepack enable

# Copy source and install packages
COPY . .
RUN pnpm install --frozen-lockfile

# Build DB migration script
RUN cd packages/db \
    && pnpm dlx @vercel/ncc build migrate.ts -o /db_migrations \
    && cp -R drizzle /db_migrations

# Compile Next.js app in "compile" mode
RUN cd apps/web && pnpm exec next build --experimental-build-mode compile


########################
# Application Builder (shared base)
########################
FROM node:22-alpine AS aio_builder

LABEL org.opencontainers.image.source="https://github.com/paulcoding810/mockj"

WORKDIR /app

# Build-time argument
ARG SERVER_VERSION=nightly
ENV SERVER_VERSION=${SERVER_VERSION}

# Runtime configuration
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Install runtime dependencies
RUN apk add --no-cache monolith

# Copy artifacts from base builder
COPY --from=base --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base /db_migrations /db_migrations
COPY --from=base --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=base --chown=node:node /app/docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Ensure Next.js runtime dirs exist
RUN mkdir -p ./apps/web/.next && chown node:node ./apps/web/.next

########################
# Migration Service
########################
FROM aio_builder AS migrations

WORKDIR /db_migrations

RUN node index.js

########################
# Web Service
########################
FROM aio_builder AS web

WORKDIR /app/apps/web

# Optional healthcheck (uncomment if needed)
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]

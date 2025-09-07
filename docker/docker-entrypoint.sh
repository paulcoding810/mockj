#!/bin/sh
set -e

# Ensure data dir exists
mkdir -p "/data"
chown -R node:node "/data"

# Run DB migrations (idempotent)
cd /db_migrations
node index.js

# Start Next.js standalone server
cd /app/apps/web
exec node server.js
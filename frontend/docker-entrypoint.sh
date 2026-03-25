#!/bin/sh
set -e

# Railway sets PORT automatically; default to 3000 for local Docker
export PORT="${PORT:-3000}"

# Default backend URL for local Docker Compose (service name = "backend")
export BACKEND_URL="${BACKEND_URL:-http://backend:8080}"

echo "Starting Nyaya frontend..."
echo "  PORT:        $PORT"
echo "  BACKEND_URL: $BACKEND_URL"

# Substitute env vars into nginx config template
envsubst '${PORT} ${BACKEND_URL}' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "Nginx config generated. Starting nginx..."
exec nginx -g 'daemon off;'

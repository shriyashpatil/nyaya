# ---- Build Stage ----
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY . .
RUN npm run build

# ---- Serve Stage ----
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built React app
COPY --from=builder /app/build .

# Copy nginx template (envsubst fills in BACKEND_URL and PORT at runtime)
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copy and prepare entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Railway assigns PORT dynamically; default 3000 for local
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q http://localhost:${PORT:-3000}/health -O /dev/null || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]

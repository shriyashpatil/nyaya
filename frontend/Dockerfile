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

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built React app
COPY --from=builder /app/build .

# Nginx config for React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q http://localhost:3000 || exit 1

CMD ["nginx", "-g", "daemon off;"]

# ---- Base image ----
FROM node:20-alpine

# ---- Set working directory ----
WORKDIR /app

# ---- Install dependencies first (for caching) ----
COPY package*.json ./
RUN npm ci --only=production

# ---- Copy application code ----
COPY ./app .

# ---- Security: run as non-root user ----
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# ---- Expose port ----
EXPOSE 3000

# ---- Environment ----
ENV NODE_ENV=production

# ---- Start app ----
CMD ["node", "index.js"]
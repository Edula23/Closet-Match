# syntax=docker/dockerfile:1.7
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --no-audit --no-fund
COPY . .
EXPOSE 5000
COPY entrypoint.sh ./entrypoint.sh
CMD ["sh", "./entrypoint.sh"]
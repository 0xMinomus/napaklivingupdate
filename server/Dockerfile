# Build the API (workspace-aware monorepo build)
FROM node:24-alpine AS api-build
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json server/package.json
RUN npm ci

COPY . .
RUN npm run build --workspace server
RUN npx prisma generate --schema server/prisma/schema.prisma

# Runtime
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=api-build /app/node_modules ./node_modules
COPY --from=api-build /app/server ./server

EXPOSE 3000
CMD ["node", "server/dist/server.js"]
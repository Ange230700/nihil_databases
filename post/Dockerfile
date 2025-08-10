# post\Dockerfile

# post/Dockerfile

# build stage
FROM node:24-alpine3.21 AS build
WORKDIR /app
COPY package*.json nx.json ./
COPY shared ./shared
COPY post ./post
RUN npm ci
RUN npm run prisma:generate --workspace=post && npm run build:all

# run stage
FROM node:24-alpine3.21
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
# DB URL passed at runtime
CMD ["sh", "-lc", "npm run prisma:db:push --workspace=post && npm run prisma:db:seed --workspace=post && tail -f /dev/null"]


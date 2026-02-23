FROM node:24-alpine AS builder
LABEL author="jaedsonnm@gmail.com"
WORKDIR  /app
COPY . /app
COPY  package*.json /app
RUN npm ci --audit false && npm run build

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist /app
COPY --from=builder /app/package*.json /app
COPY --from=builder /app/node_modules /app
RUN npm ci --omit=dev --audit false
EXPOSE 3000

ENTRYPOINT [ "node", "./app.js" ]

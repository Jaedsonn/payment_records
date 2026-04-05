FROM node:22-alpine AS builder
WORKDIR /app
COPY  ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY  --from=builder /app/dist ./dist
COPY  --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
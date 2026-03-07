FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN ls dist/main.js

EXPOSE 3001

# seed roda separado (npm run prisma:seed) — nunca aqui, pois usa deleteMany
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

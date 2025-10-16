FROM node:22-alpine

WORKDIR /app

COPY package*.json .

COPY prisma ./prisma

ENV SKIP_PRISMA_GENERATE=true

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "./src/server.js"]
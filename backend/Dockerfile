FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/build ./build

COPY package.json package-lock.json ./

RUN npm ci --only=production

EXPOSE 1234

CMD ["node", "./build/app.js"]

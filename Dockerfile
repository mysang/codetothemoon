FROM node:18-alpine

RUN npm install -g pnpm@8.1.0

WORKDIR /app

COPY ./src/package.json /app
COPY ./src/pnpm-lock.yaml /app

RUN pnpm install --frozen-lockfile

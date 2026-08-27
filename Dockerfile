# syntax=docker/dockerfile:1

FROM node:trixie-slim AS build
WORKDIR /app
ARG VITE_SITE_URL=http://localhost:4173
ENV VITE_SITE_URL=$VITE_SITE_URL
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:demo

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

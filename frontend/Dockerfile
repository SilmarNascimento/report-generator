# build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:fast

# runtime
FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

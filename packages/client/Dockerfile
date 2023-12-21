# Stage 1 - Install dependencies and build the app
FROM debian:latest AS build-env

# Install flutter dependencies 
RUN apt-get update
RUN apt-get install -y git
RUN apt-get clean

# Clone repository to container and build
WORKDIR /source
COPY . .

# Stage 2 - Create the app
FROM node:18.15.0 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install -g pnpm
COPY --from=build-env /source .
RUN pnpm install
RUN pnpm run build

# Stage 3 - Create the run-time image
FROM nginx:stable
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/
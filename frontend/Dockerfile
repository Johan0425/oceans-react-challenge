# This Dockerfile is used to build and serve a React application using a multi-stage build process.

# Stage 1: Builder
# - Uses the Node.js 20 Alpine image as the base image for building the application.
# - Sets the working directory to /app.
# - Copies the package.json and package-lock.json files to the working directory.
# - Installs the project dependencies using npm.
# - Copies the entire project into the working directory.
# - Builds the React application using the `npm run build` command, which outputs the production-ready files to the /app/dist directory.

# Stage 2: Nginx Server
# - Uses the Nginx Alpine image as the base image for serving the built application.
# - Copies the built files from the builder stage (/app/dist) to the Nginx default HTML directory (/usr/share/nginx/html).
# - Exposes port 80 to allow HTTP traffic.
# - Sets the default command to start Nginx in the foreground (daemon off mode).

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
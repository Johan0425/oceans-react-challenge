# This Dockerfile is used to create a lightweight container for a Node.js application.
# It is based on the official Node.js 18 image with Alpine Linux for minimal size.

# Step 1: Set the working directory inside the container to /app.
# All subsequent commands will be executed relative to this directory.

# Step 2: Copy the package.json and package-lock.json files into the container.
# These files are required to install the application's dependencies.

# Step 3: Install the dependencies using npm. This ensures the application has
# all the required packages to run.

# Step 4: Copy the entire application source code into the container.
# This includes all files and directories in the current context.

# Step 5: Build the application using the npm build script.
# This step is typically used to compile or prepare the application for production.

# Step 6: Expose port 3000 to allow external access to the application.
# This is the port the application will listen on.

# Step 7: Define the default command to run the application.
# The application will start by executing the dist/app.js file using Node.js.

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/app.js"]
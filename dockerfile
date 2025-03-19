# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies (MySQL, Node.js, and utilities)
RUN apt-get update && \
    apt-get install -y \
    gnupg \
    wget \
    lsb-release \
    curl \
    ca-certificates \
    mysql-client \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm 11
RUN npm install -g npm@11

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 9999

# Command to run the application
CMD ["node", "app.js"]
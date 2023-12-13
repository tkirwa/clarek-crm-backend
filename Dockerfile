# Use the official Ubuntu 22.04 LTS image
FROM ubuntu:22.04

# Set the working directory in the container
WORKDIR /clarek-crm-backend
# WORKDIR /app

# Update the package list and install required dependencies
RUN apt-get update && \
    apt-get install -y nodejs npm redis-server

# Install MongoDB prerequisites
RUN apt-get update && \
    apt-get install -y gnupg

# Add the MongoDB repository key directly to trusted.gpg.d
RUN mkdir -p /etc/apt/trusted.gpg.d \
    && gpg --keyserver keyserver.ubuntu.com --recv 656408E390CFB1F5 \
    && gpg --export --armor 656408E390CFB1F5 > /etc/apt/trusted.gpg.d/mongodb.gpg

# Add MongoDB repository
RUN echo "deb http://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update the package list and install MongoDB
RUN apt-get update && \
    apt-get install -y mongodb-org

# Create the MongoDB data directory
RUN mkdir -p /data/db

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose ports for MongoDB and Redis
EXPOSE 3000 27017 6379

# Define the command to run your application
CMD ["npm", "start"]

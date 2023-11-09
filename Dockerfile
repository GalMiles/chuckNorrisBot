# Use the official lightweight Node.js 16 image.
FROM node:16-slim

# Create and change to the app directory.
WORKDIR /chuckNorrisBot

# Copy package.json and package-lock.json to the working directory
COPY package*.json /chuckNorrisBot/

# Install production dependencies.
RUN RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && npm install --production \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

# Copy local code to the container image.
COPY . /chuckNorrisBot

# Run the web service on container startup.
CMD [ "node", "server.js" ]

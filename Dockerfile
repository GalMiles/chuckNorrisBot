# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:16-slim

# Create and change to the app directory.
WORKDIR /chuckNorrisBot

# Copy package.json and package-lock.json to the working directory
COPY package*.json /chuckNorrisBot/

# Install production dependencies.
RUN apt-get update && apt-get install -y --no-install-recommends \
    && apt-get install -y wget gnupg2 ca-certificates apt-transport-https \
    #ca-certificates \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && npm install --production \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

# Copy local code to the container image.
COPY . /chuckNorrisBot

# Run the web service on container startup.
CMD [ "node", "server.js" ]

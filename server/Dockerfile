FROM node:16.4-slim

WORKDIR /usr/src

ENV NODE_ENV=production

# Install system dependencies
# - libssl-dev for Prisma Client
RUN apt-get update -y && \
  apt-get install -y libssl-dev

RUN chown node:node /usr/src
USER node

# run "docker build . -f ./server/Dockerfile" from outside the "server" dir
COPY --chown=node:node ./ ./

WORKDIR /usr/src/server

COPY --chown=node:node ./server/package*.json ./
RUN npm ci && npm cache clean --force

RUN npm run prisma:generate

EXPOSE 3000

CMD [ "npm", "run", "start" ]

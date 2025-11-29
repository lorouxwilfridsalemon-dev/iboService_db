# Download nodejs stable version 12
FROM node:12-alpine AS builder

# Arg
ARG ENV=staging
ARG PORT

RUN echo $ENV
RUN export ENV=$ENV

# Create app directory
RUN mkdir /app
WORKDIR /app

# Copy source code
COPY . /app

# Build node app
RUN npm ci --prefer-offline --no-audit
RUN npm run build:${ENV}

RUN touch .env.${ENV} && cp .env.${ENV} .env 
RUN touch config.json.${ENV} && cp config.json.${ENV} dist/config.json

# Launch npm 
CMD [ "npm", "run", "start:production" ]

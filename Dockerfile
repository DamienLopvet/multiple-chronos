FROM node:14-alpine

WORKDIR /app


COPY package.json /app

RUN npm install

RUN npm install --global @vue/cli

COPY . /app

ENTRYPOINT [ "npm"]
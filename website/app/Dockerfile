FROM node:latest
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install express
RUN npm install mariadb
USER node
RUN npm install
WORKDIR /home/node/app
COPY --chown=node:node ./code/ .
EXPOSE 8080
CMD [ "node", "app.js"]
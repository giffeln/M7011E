FROM node:latest
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN npm install -g nodemon
USER node
COPY --chown=node:node ./code/ .
RUN npm install
WORKDIR /home/node/app
EXPOSE 8080
CMD [ "node", "app.js"]

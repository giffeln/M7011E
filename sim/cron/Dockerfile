FROM node:8-alpine
COPY --chown=root:root ./cron /etc/crontabs/root
COPY --chown=root:root ./code/ /home/node/
WORKDIR /home/node
RUN npm install
CMD chown root:root /etc/crontabs/root && /usr/sbin/crond -f
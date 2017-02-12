sudo \
    MONGO_URL=mongodb://localhost:27017/schat \
    PORT=7042 \
    ROOT_URL=https://chat.speako.ca \
    METEOR_SETTINGS="$(cat settings.json)" \
pm2 start \
    --interpreter /usr/local/node-v4.6.2-linux-x64/bin/node \
    --name schat \
    /var/www/production/schat/bundle/main.js

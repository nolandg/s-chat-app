sudo \
    MONGO_URL=mongodb://localhost:27017/speako-dev \
    PORT=7011 \
    ROOT_URL=https://dev.speako.ca \
    METEOR_SETTINGS="$(cat settings.json)" \
pm2 start \
    --interpreter /usr/local/node-v4.6.2-linux-x64/bin/node \
    --name speako-dev \
    /var/www/production/speako-dev/bundle/main.js

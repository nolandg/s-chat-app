sudo \
    MONGO_URL=mongodb://localhost:27017/speako \
    PORT=7010 \
    ROOT_URL=https://speako.ca \
    METEOR_SETTINGS="$(cat settings.json)" \
pm2 start \
    --interpreter /usr/local/node-v4.6.2-linux-x64/bin/node \
    --name speako \
    /var/www/production/speako/bundle/main.js

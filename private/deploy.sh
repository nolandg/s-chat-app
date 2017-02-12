meteor build --directory /var/www/production/schat
cd /var/www/production/schat/bundle/programs/server
meteor npm install
sudo pm2 restart schat

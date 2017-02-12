echo "############################## Pulling ##############################"
git pull
echo "############################## Stopping All pm2 Processes ##############################"
sudo pm2 stop all
echo "############################## Building ##############################"
meteor build --directory /var/www/production/speako-dev
echo "############################## Re-installing Fibers ##############################"
cd /var/www/production/speako-dev/bundle/programs/server
meteor npm install
echo "############################## Restarting All pm2 Processes ##############################"
sudo pm2 restart all

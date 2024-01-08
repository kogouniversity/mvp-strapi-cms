APP_DIR=/home/ec2-user/kogo/kogo-cms
PM2_DIR=/home/ec2-user/kogo/pm2

cd $APP_DIR
echo "[POST-DEPLOY] Installing Node Dependencies"
npm install

# echo "[POST-DEPLOY] Creating a Development Build"
# npm run build

cd $PM2_DIR
echo "[POST-DEPLOY] Starting on PM2"
pm2 delete kogo-cms > /dev/null
pm2 start ecosystem.config.js


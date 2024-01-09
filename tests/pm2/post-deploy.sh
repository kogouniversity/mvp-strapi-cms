APP_DIR=/home/ec2-user/kogo/kogo-cms
PM2_DIR=/home/ec2-user/kogo/pm2

echo "[POST-DEPLOY] Delete running application from PM2"
pm2 delete kogo-cms > /dev/null

echo "[POST-DEPLOY] Installing Node Dependencies"
cd $APP_DIR
npm install

# Temporary disabed due to insufficient RAM size
# =================================================
# echo "[POST-DEPLOY] Creating a Development Build"
# npm run build
# =================================================


echo "[POST-DEPLOY] Starting on PM2"
cd $PM2_DIR
pm2 start ecosystem.config.js


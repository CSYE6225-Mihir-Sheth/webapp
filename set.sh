#!/bin/bash

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install unzip
sudo apt-get install nodejs npm -y
sudo apt-get install mariadb-server -y
sudo mysql -e "SET PASSWORD FOR root@localhost = PASSWORD('$MARIA_DB_PASSWORD');FLUSH PRIVILEGES;"
printf "%s\n n\n n\n n\n n\n n\n y\n" "$MARIA_DB_PASSWORD" | sudo mysql_secure_installation
sudo mysql -u root -p"$MARIA_DB_PASSWORD" -Bse "CREATE DATABASE $MYSQL_DB;"
sudo mysql -e "GRANT ALL PRIVILEGES ON $MYSQL_DB.* TO 'root'@'localhost' IDENTIFIED BY '$MARIA_DB_PASSWORD';"
sudo mysql -u root -p"$MARIA_DB_PASSWORD" -Bse "SHOW DATABASES;"
sudo mkdir opt
sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip
sudo mv /home/admin/users.csv /home/admin/opt/webapp/users.csv
cd opt
sudo unzip -o webapp.zip
sudo npm i
sudo npm rebuild bcrypt

echo "password=$MARIA_DB_PASSWORD"
echo "user=$MARIA_DB_USER"
echo "db=$MYSQL_DB"

sudo mysql -u root -p"%s" "$MARIA_DB_PASSWORD" -Bse "SHOW DATABASES;"


sudo npm run test
# sudo npm start
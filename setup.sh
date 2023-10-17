#!/bin/sh
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install unzip
sudo apt-get install nodejs npm -y
sudo apt-get install mariadb-server -y
sudo mysql -u root -e "SET PASSWORD 'root'@'localhost' = PASSWORD(root123');"
printf 'root123\nn\nn\nn\nn\nn\ny\n' | sudo mysql_secure_installation;
sudo mysql -e "GRANT ALL PRIVILEGES ON healthCheck.* TO 'root'@'localhost' IDENTIFIED BY 'root123';"
sudo mysql -e "FLUSH PRIVILEGES;"
mysql -u root -proot123 -Bse "CREATE DATABASE healthCheck;"
mysql -u root -proot123 -Bse "SHOW DATABASES;"
sudo mkdir opt
sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip
sudo mv /home/admin/users.csv /home/admin/opt/users.csv
cd opt
sudo unzip -o webapp.zip
#cd webapp
sudo npm install

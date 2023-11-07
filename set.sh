#!/bin/sh

sudo apt-get update
sudo apt-get upgrade -y
sudo apt install unzip
sudo apt install nodejs npm -y

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

sudo mv /home/admin/webapp.zip /opt/csye6225/webapp.zip
cd /opt/csye6225
sudo unzip -o webapp.zip
sudo mv /home/admin/users.csv /opt/csye6225/webapp/users.csv
sudo mv /home/admin/cloudwatch-config.json /opt/csye6225/webapp/cloudwatch-config.json
cd /opt/csye6225/webapp
sudo npm i
sudo cp /home/admin/app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable app.service
sudo systemctl start app.service

sudo wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent
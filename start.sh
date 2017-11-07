#!/bin/bash
export MYSQL_PWD=random; 
mysql -u development -e "CREATE DATABASE IF NOT EXISTS app_db";
mysql -u development app_db < ./data/app_db.sql;
export MYSQL_PWD=;
node app.js
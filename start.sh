#!/bin/bash
export MYSQL_PWD=random; 
mysql -u development -e "CREATE DATABASE IF NOT EXISTS app_db";
export MYSQL_PWD=;
node app.js
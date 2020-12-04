#!/bin/sh

mysqld --basedir=/opt/mysql/mysql --datadir=/opt/mysql/mysql/data &>/dev/null &

./wait-for.sh localhost:5432 -- node /app/app.js

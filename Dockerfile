FROM ubuntu:focal

ENV TZ=Asia/Dushanbe

RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install nodejs -y && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    apt-get install -y --no-install-recommends mysql-server mysql-client netcat

COPY ./init.sql /tmp/init.sql
RUN mkdir /var/run/mysqld && \
    chown mysql:mysql /var/run/mysqld && \
    mkdir -p /opt/mysql/mysql/data && \
    chown -R mysql:mysql /opt/mysql/mysql && \
    chmod 750 /opt/mysql/mysql/data && \
    mysqld --initialize-insecure --user=mysql --basedir=/opt/mysql/mysql --datadir=/opt/mysql/mysql/data --init_file=/tmp/init.sql
# RUN docker pull postgres:11.5 \
#     docker run --name postgres -e POSTGRES_PASSWORD=supreme -d postgres:11.5
RUN apt-get install wget ca-certificates && \
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list' && \
    apt-get update && \
    apt-get install postgresql postgresql-contrib && \
    su - postgres && \
    psql && \
    CREATE ROLE postgres WITH LOGIN CREATEDB ENCRYPTED PASSWORD 'supreme'; && \
    \q
COPY ./*.sh ./app/

RUN chmod +x ./app/*.sh

WORKDIR /app
COPY ./*.js* /app/
RUN npm install

EXPOSE 9999

CMD ["/app/run.sh"]

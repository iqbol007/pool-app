ALTER USER 'root'@'localhost' IDENTIFIED BY 'pass';

CREATE USER 'postgres'@'localhost' IDENTIFIED BY 'supreme';
CREATE DATABASE postDataBase CHARACTER SET utf8 COLLATE utf8_general_ci;
GRANT ALL PRIVILEGES ON postDataBase.* to 'postgres'@'localhost';

FLUSH PRIVILEGES ;
 
-- CREATE TABLE postDataBase.posts (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     content TEXT,
--     owner_id TEXT,
--     post_id INT,
--     media_type TEXT,
--     media text,
--     removed BOOL NOT NULL DEFAULT FALSE,
--     created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE TABLE postDataBase.users()
CREATE USER cutecat WITH PASSWORD 'hideouscat';
CREATE DATABASE cutecat;
GRANT ALL PRIVILEGES ON DATABASE "cutecat" to cutecat;

DROP TABLE IF EXISTS cats CASCADE;
CREATE TABLE cats (
    cat_id bigserial PRIMARY KEY,
    filename varchar(100),
    times_picked bigint
);
CREATE USER cutecat WITH PASSWORD 'hideouscat';
CREATE DATABASE cutecat;
GRANT ALL PRIVILEGES ON DATABASE "cutecat" to cutecat;

DROP TABLE IF EXISTS cats CASCADE;
CREATE TABLE cats (
    cat_id bigserial PRIMARY KEY,
    filename varchar(100),
    times_picked bigint DEFAULT 0,
    last_picked_on timestamp DEFAULT statement_timestamp()
);

INSERT INTO cats (filename) VALUES ('cat001.jpg'),
('cat002.jpg'), ('cat003.jpg'), ('cat004.jpg'), ('cat005.jpg'),
('cat006.jpg'), ('cat007.jpg'), ('cat008.jpg'), ('cat009.jpg'), 
('cat010.jpg'), ('cat011.jpg'), ('cat012.jpg'), ('cat013.jpg'), 
('cat014.jpg'), ('cat015.jpg'), ('cat016.jpg'), ('cat017.jpg'),
('cat018.jpg'), ('cat019.jpg'), ('cat020.jpg'), ('cat021.jpg'), 
('cat022.jpg'), ('cat023.jpg'), ('cat024.jpg'), ('cat025.jpg'), 
('cat026.jpg'), ('cat027.jpg'), ('cat028.jpg'), ('cat029.jpg'), 
('cat030.jpg'), ('cat031.jpg'), ('cat032.jpg'), ('cat033.jpg'), 
('cat034.jpg'), ('cat035.jpg'), ('cat036.jpg'), ('cat037.jpg'), 
('cat038.jpg'), ('cat039.jpg');
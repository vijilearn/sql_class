SHOW TABLES;

CREATE TABLE user (
        id VARCHAR(80) PRIMARY KEY,
      username VARCHAR(50) UNIQUE,
      email VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(50)  NOT NULL
    
);
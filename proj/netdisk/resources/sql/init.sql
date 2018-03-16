CREATE database DB_CLOUD_STORAGE DEFAULT charset utf8 collate utf8_general_ci;

USE DB_CLOUD_STORAGE;

CREATE table T_USER (
  id int PRIMARY KEY AUTO_INCREMENT NOT NULL ,
  username varchar(32) NOT NULL ,
  password varchar(32)
) ENGINE=INNODB;

CREATE table T_FILE(
	id int PRIMARY KEY AUTO_INCREMENT NOT NULL ,
	file_name varchar(256) NOT NULL,
	createtime datetime NOT NULL,
	localurl varchar(128) NOT NULL,
	file_size int NOT NULL ,
	folder_id int
) ENGINE=INNODB;

CREATE table T_FOLDER(
	id int PRIMARY KEY AUTO_INCREMENT NOT NULL ,
	folder_name varchar(256) NOT NULL,
	createtime datetime NOT NULL,
	parent_folder_id int,
	username_id int NOT NULL
) ENGINE=INNODB;

CREATE table T_SHARE(
	id int PRIMARY KEY AUTO_INCREMENT NOT NULL ,
	share_flag char(10) NOT NULL,
	share_user_id int NOT  NULL ,
	share_f_id int,
	share_type tinyint
) ENGINE=INNODB;
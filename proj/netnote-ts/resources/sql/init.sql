-- 在此放置数据库创建，以及数据初始化语句

CREATE DATABASE DB_NET_NOTE
  DEFAULT CHARSET utf8
  COLLATE utf8_general_ci;

USE DB_NET_NOTE;

CREATE TABLE T_DIRECTORY (
  dir_id        INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
  dir_name      VARCHAR(256) NOT NULL,
  dir_parent_id INT,
  dir_user_id   INT          NOT NULL
)
  ENGINE = INNODB;

CREATE TABLE T_NOTE (
  note_id         INT          NOT NULL  PRIMARY KEY AUTO_INCREMENT,
  note_name       VARCHAR(256) NOT NULL,
  note_text       LONGTEXT     NOT NULL,
  note_createtime TIMESTAMP    NOT NULL,
  note_parent_id  INT          NOT NULL,
  note_user_id    INT          NOT NULL
)
  ENGINE = INNODB;

CREATE TABLE T_ATTACH (
  attach_id          INT          NOT NULL  PRIMARY KEY AUTO_INCREMENT,
  attach_note_id     INT          NOT NULL,
  attach_user_id     INT          NOT NULL,
  attach_net_disk_id INT          NOT NULL,
  attach_filename    VARCHAR(256) NOT NULL,
  attach_size        INT          NOT NULL
)
  ENGINE = INNODB;

CREATE TABLE T_TAG (
  tag_id   INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
  tag_name VARCHAR(128) NOT NULL
)
  ENGINE = INNODB;

CREATE TABLE T_TAG_NOTE (
  tag_note_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  tag_id      INT NOT NULL,
  note_id     INT NOT NULL
)
  ENGINE = INNODB;

CREATE TABLE T_SHARE (
  share_id             INT         NOT NULL PRIMARY KEY AUTO_INCREMENT,
  share_url            VARCHAR(10) NOT NULL,
  share_note_or_dir_id INT         NOT NULL,
  share_type           TINYINT     NOT NULL,
  share_user_id        INT         NOT NULL
)
  ENGINE = INNODB;

CREATE TABLE T_IMAGE (
  image_id        INT          NOT NULL PRIMARY KEY  AUTO_INCREMENT,
  image_url       CHAR(15)     NOT NULL,
  image_localpath VARCHAR(128) NOT NULL,
  image_name      VARCHAR(256) NOT NULL
)
  ENGINE = INNODB;




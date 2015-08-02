/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50625
Source Host           : localhost:3306
Source Database       : exp

Target Server Type    : MYSQL
Target Server Version : 50625
File Encoding         : 65001

Date: 2015-08-02 23:05:54
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for wx_images
-- ----------------------------
DROP TABLE IF EXISTS `wx_images`;
CREATE TABLE `wx_images` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `imgurl` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for wx_materials
-- ----------------------------
DROP TABLE IF EXISTS `wx_materials`;
CREATE TABLE `wx_materials` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(500) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL COMMENT '1:文本 2：图片 3: 图文 4：语音 5：视频',
  `link_out` tinyint(1) unsigned DEFAULT NULL COMMENT '是否跳转',
  `title` varchar(500) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `pic_url` varchar(500) DEFAULT NULL,
  `music_url` varchar(500) DEFAULT NULL,
  `media_id` varchar(500) DEFAULT NULL,
  `thumb_media_id` varchar(500) DEFAULT NULL,
  `author` varchar(50) DEFAULT NULL,
  `content` text,
  `source_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COMMENT='素材表';

-- ----------------------------
-- Table structure for wx_users
-- ----------------------------
DROP TABLE IF EXISTS `wx_users`;
CREATE TABLE `wx_users` (
  `id` int(11) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  `gender` char(255) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

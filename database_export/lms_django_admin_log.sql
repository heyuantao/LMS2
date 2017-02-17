-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: lms
-- ------------------------------------------------------
-- Server version	5.7.17-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin__content_type_id_c4bce8eb_fk_django_content_type_id` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin__content_type_id_c4bce8eb_fk_django_content_type_id` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2017-02-03 13:40:23','1','计算机学院------1',1,'[{\"added\": {}}]',10,1),(2,'2017-02-03 13:40:31','2','软件学院------2',1,'[{\"added\": {}}]',10,1),(3,'2017-02-03 13:41:16','1','1-2节------1',1,'[{\"added\": {}}]',9,1),(4,'2017-02-03 13:41:25','2','3-4节------2',1,'[{\"added\": {}}]',9,1),(5,'2017-02-03 13:41:33','3','5-6节------3',1,'[{\"added\": {}}]',9,1),(6,'2017-02-03 13:41:46','4','7-8节------4',1,'[{\"added\": {}}]',9,1),(7,'2017-02-03 13:41:55','5','9-10节------5',1,'[{\"added\": {}}]',9,1),(8,'2017-02-03 13:43:06','1','第1周------1',1,'[{\"added\": {}}]',13,1),(9,'2017-02-03 13:43:14','2','第2周------2',1,'[{\"added\": {}}]',13,1),(10,'2017-02-03 13:43:25','3','第3周------3',1,'[{\"added\": {}}]',13,1),(11,'2017-02-03 13:43:34','4','第4周------4',1,'[{\"added\": {}}]',13,1),(12,'2017-02-03 13:43:42','5','第5周------5',1,'[{\"added\": {}}]',13,1),(13,'2017-02-03 13:43:50','6','第6周------6',1,'[{\"added\": {}}]',13,1),(14,'2017-02-03 13:43:58','7','第7周------7',1,'[{\"added\": {}}]',13,1),(15,'2017-02-03 13:44:48','7','周7------7',2,'[{\"changed\": {\"fields\": [\"name\"]}}]',13,1),(16,'2017-02-03 13:45:01','6','周6------6',2,'[{\"changed\": {\"fields\": [\"name\"]}}]',13,1),(17,'2017-02-03 13:45:13','5','周5------5',2,'[{\"changed\": {\"fields\": [\"name\"]}}]',13,1),(18,'2017-02-03 13:45:25','4','周4------4',2,'[{\"changed\": {\"fields\": [\"name\"]}}]',13,1),(19,'2017-02-03 13:45:36','3','周3------3',2,'[{\"changed\": {\"fields\": [\"name\"]}}]',13,1),(20,'2017-02-03 13:45:45','2','第2周------2',2,'[]',13,1),(21,'2017-02-03 13:45:57','2','周2------2',2,'[{\"changed\": {\"fields\": [\"name\"]}}]',13,1),(22,'2017-02-03 13:46:08','1','周1------1',2,'[{\"changed\": {\"fields\": [\"name\"]}}]',13,1),(23,'2017-02-03 13:46:49','1','第1周------1',1,'[{\"added\": {}}]',16,1),(24,'2017-02-03 13:46:56','2','第2周------2',1,'[{\"added\": {}}]',16,1),(25,'2017-02-03 13:47:03','3','第3周------3',1,'[{\"added\": {}}]',16,1),(26,'2017-02-03 13:47:13','4','第4周------4',1,'[{\"added\": {}}]',16,1),(27,'2017-02-03 13:47:22','5','第5周------5',1,'[{\"added\": {}}]',16,1),(28,'2017-02-03 13:47:29','6','第6周------6',1,'[{\"added\": {}}]',16,1),(29,'2017-02-03 13:47:37','7','第7周------7',1,'[{\"added\": {}}]',16,1),(30,'2017-02-03 13:47:45','8','第8周------8',1,'[{\"added\": {}}]',16,1),(31,'2017-02-03 13:47:57','9','第9周------9',1,'[{\"added\": {}}]',16,1),(32,'2017-02-03 13:48:05','10','第10周------10',1,'[{\"added\": {}}]',16,1),(33,'2017-02-03 13:48:11','11','第11周------11',1,'[{\"added\": {}}]',16,1),(34,'2017-02-03 13:48:18','12','第12周------12',1,'[{\"added\": {}}]',16,1),(35,'2017-02-03 13:48:32','13','第13周------13',1,'[{\"added\": {}}]',16,1),(36,'2017-02-03 13:48:39','14','第14周------14',1,'[{\"added\": {}}]',16,1),(37,'2017-02-03 13:48:47','15','第15周------15',1,'[{\"added\": {}}]',16,1),(38,'2017-02-03 13:49:02','16','第16周------16',1,'[{\"added\": {}}]',16,1),(39,'2017-02-03 13:49:11','17','第17周------17',1,'[{\"added\": {}}]',16,1),(40,'2017-02-03 13:50:02','1','实验------1',1,'[{\"added\": {}}]',11,1),(41,'2017-02-03 13:50:09','2','课程设计------2',1,'[{\"added\": {}}]',11,1),(42,'2017-02-03 13:50:16','3','上机------3',1,'[{\"added\": {}}]',11,1),(43,'2017-02-03 13:50:52','1','08A502------1',1,'[{\"added\": {}}]',17,1),(44,'2017-02-03 13:51:00','2','08A503------2',1,'[{\"added\": {}}]',17,1),(45,'2017-02-03 13:51:13','3','08A506------3',1,'[{\"added\": {}}]',17,1),(46,'2017-02-03 13:51:30','4','S414------10',1,'[{\"added\": {}}]',17,1),(47,'2017-02-03 13:51:40','5','S415------11',1,'[{\"added\": {}}]',17,1),(48,'2017-02-03 13:52:48','1','邹芳芳------3232423432',1,'[{\"added\": {}}]',15,1),(49,'2017-02-03 13:52:58','2','张超伟------324234234',1,'[{\"added\": {}}]',15,1),(50,'2017-02-03 13:53:17','3','杨凯------324324324',1,'[{\"added\": {}}]',15,1),(51,'2017-02-06 00:00:04','3','未选择------3',1,'[{\"added\": {}}]',10,1),(52,'2017-02-06 00:01:05','6','未选择------10',1,'[{\"added\": {}}]',17,1),(53,'2017-02-06 00:01:26','18','未选择------100',1,'[{\"added\": {}}]',16,1),(54,'2017-02-06 00:01:46','8','未选择------100',1,'[{\"added\": {}}]',13,1),(55,'2017-02-06 00:02:07','6','未选择------100',1,'[{\"added\": {}}]',9,1),(56,'2017-02-06 00:02:40','4','未选择------0000000000',1,'[{\"added\": {}}]',15,1),(57,'2017-02-06 00:03:01','4','未选择------100',1,'[{\"added\": {}}]',11,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-06 22:11:53

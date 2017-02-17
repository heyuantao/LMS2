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
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permissi_content_type_id_2f476e4b_fk_django_content_type_id` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can add group',2,'add_group'),(5,'Can change group',2,'change_group'),(6,'Can delete group',2,'delete_group'),(7,'Can add permission',3,'add_permission'),(8,'Can change permission',3,'change_permission'),(9,'Can delete permission',3,'delete_permission'),(10,'Can add user',4,'add_user'),(11,'Can change user',4,'change_user'),(12,'Can delete user',4,'delete_user'),(13,'Can add content type',5,'add_contenttype'),(14,'Can change content type',5,'change_contenttype'),(15,'Can delete content type',5,'delete_contenttype'),(16,'Can add session',6,'add_session'),(17,'Can change session',6,'change_session'),(18,'Can delete session',6,'delete_session'),(19,'Can add system setting model',7,'add_systemsettingmodel'),(20,'Can change system setting model',7,'change_systemsettingmodel'),(21,'Can delete system setting model',7,'delete_systemsettingmodel'),(22,'Can add profile model',8,'add_profilemodel'),(23,'Can change profile model',8,'change_profilemodel'),(24,'Can delete profile model',8,'delete_profilemodel'),(25,'Can add lesson model',9,'add_lessonmodel'),(26,'Can change lesson model',9,'change_lessonmodel'),(27,'Can delete lesson model',9,'delete_lessonmodel'),(28,'Can add lab model',10,'add_labmodel'),(29,'Can change lab model',10,'change_labmodel'),(30,'Can delete lab model',10,'delete_labmodel'),(31,'Can add course type model',11,'add_coursetypemodel'),(32,'Can change course type model',11,'change_coursetypemodel'),(33,'Can delete course type model',11,'delete_coursetypemodel'),(34,'Can add course model',12,'add_coursemodel'),(35,'Can change course model',12,'change_coursemodel'),(36,'Can delete course model',12,'delete_coursemodel'),(37,'Can add week model',13,'add_weekmodel'),(38,'Can change week model',13,'change_weekmodel'),(39,'Can delete week model',13,'delete_weekmodel'),(40,'Can add arrangement model',14,'add_arrangementmodel'),(41,'Can change arrangement model',14,'change_arrangementmodel'),(42,'Can delete arrangement model',14,'delete_arrangementmodel'),(43,'Can add assistant model',15,'add_assistantmodel'),(44,'Can change assistant model',15,'change_assistantmodel'),(45,'Can delete assistant model',15,'delete_assistantmodel'),(46,'Can add term week model',16,'add_termweekmodel'),(47,'Can change term week model',16,'change_termweekmodel'),(48,'Can delete term week model',16,'delete_termweekmodel'),(49,'Can add room model',17,'add_roommodel'),(50,'Can change room model',17,'change_roommodel'),(51,'Can delete room model',17,'delete_roommodel');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
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

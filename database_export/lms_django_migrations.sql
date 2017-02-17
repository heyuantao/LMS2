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
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2017-02-03 13:29:12'),(2,'auth','0001_initial','2017-02-03 13:29:14'),(3,'EXPS','0001_initial','2017-02-03 13:29:17'),(4,'EXPS','0002_auto_20170201_1009','2017-02-03 13:29:17'),(5,'EXPS','0003_auto_20170201_1018','2017-02-03 13:29:18'),(6,'EXPS','0004_auto_20170201_1940','2017-02-03 13:29:18'),(7,'EXPS','0005_auto_20170202_0930','2017-02-03 13:29:18'),(8,'EXPS','0006_auto_20170202_0933','2017-02-03 13:29:19'),(9,'admin','0001_initial','2017-02-03 13:29:19'),(10,'admin','0002_logentry_remove_auto_add','2017-02-03 13:29:20'),(11,'contenttypes','0002_remove_content_type_name','2017-02-03 13:29:20'),(12,'auth','0002_alter_permission_name_max_length','2017-02-03 13:29:20'),(13,'auth','0003_alter_user_email_max_length','2017-02-03 13:29:20'),(14,'auth','0004_alter_user_username_opts','2017-02-03 13:29:21'),(15,'auth','0005_alter_user_last_login_null','2017-02-03 13:29:21'),(16,'auth','0006_require_contenttypes_0002','2017-02-03 13:29:21'),(17,'auth','0007_alter_validators_add_error_messages','2017-02-03 13:29:21'),(18,'auth','0008_alter_user_username_max_length','2017-02-03 13:29:21'),(19,'sessions','0001_initial','2017-02-03 13:29:22'),(20,'EXPS','0007_auto_20170205_1930','2017-02-05 11:30:45'),(21,'EXPS','0008_coursemodel_lab','2017-02-05 23:57:01');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-06 22:11:54

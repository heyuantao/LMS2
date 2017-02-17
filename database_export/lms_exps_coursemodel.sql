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
-- Table structure for table `exps_coursemodel`
--

DROP TABLE IF EXISTS `exps_coursemodel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exps_coursemodel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseName` varchar(40) NOT NULL,
  `theoryClass` varchar(40) NOT NULL,
  `teacher` varchar(60) NOT NULL,
  `studentGrade` varchar(40) NOT NULL,
  `studentSubject` varchar(40) NOT NULL,
  `studentNumber` int(11) NOT NULL,
  `needAssistant` tinyint(1) NOT NULL,
  `extra` longtext NOT NULL,
  `experimentTotalCourePeriod` int(11) NOT NULL,
  `experimentTotalCourseCount` int(11) NOT NULL,
  `courseType_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lab_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `EXPS_coursemod_courseType_id_a45e3ec6_fk_EXPS_coursetypemodel_id` (`courseType_id`),
  KEY `EXPS_coursemodel_user_id_d6f1ae95_fk_auth_user_id` (`user_id`),
  KEY `EXPS_coursemodel_lab_id_c60f1e12_fk_EXPS_labmodel_id` (`lab_id`),
  CONSTRAINT `EXPS_coursemod_courseType_id_a45e3ec6_fk_EXPS_coursetypemodel_id` FOREIGN KEY (`courseType_id`) REFERENCES `exps_coursetypemodel` (`id`),
  CONSTRAINT `EXPS_coursemodel_lab_id_c60f1e12_fk_EXPS_labmodel_id` FOREIGN KEY (`lab_id`) REFERENCES `exps_labmodel` (`id`),
  CONSTRAINT `EXPS_coursemodel_user_id_d6f1ae95_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exps_coursemodel`
--

LOCK TABLES `exps_coursemodel` WRITE;
/*!40000 ALTER TABLE `exps_coursemodel` DISABLE KEYS */;
INSERT INTO `exps_coursemodel` VALUES (15,'计算机网络实验','计算机网络','张森','2010','网络工程',30,1,'',0,0,1,1,2),(16,'无线网络技术实验','无线网络技术','何渊淘','2013','网络工程',30,1,'无线路由器，无线网卡',0,0,1,1,1),(17,'路由与交换实验','路由与交换','王杰','2000','计算机网络工程',0,1,'网线',0,0,1,1,1),(18,'1','1','1','2000','1',0,1,'',0,0,1,1,1),(19,'2','1','1','2000','1',0,1,'',0,0,1,1,1),(20,'3','1','1','2000','1',0,1,'',0,0,1,1,1),(21,'3','1','1','2000','1',0,1,'',0,0,1,1,1),(22,'11','1','1','2000','1',0,1,'',0,0,1,1,1),(23,'12','1','1','2000','1',0,1,'',0,0,1,1,1),(24,'13','1','1','2000','1',0,1,'',0,0,1,1,1),(25,'14','1','1','2000','1',0,1,'',0,0,1,1,1);
/*!40000 ALTER TABLE `exps_coursemodel` ENABLE KEYS */;
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

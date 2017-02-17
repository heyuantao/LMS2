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
-- Table structure for table `exps_arrangementmodel`
--

DROP TABLE IF EXISTS `exps_arrangementmodel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exps_arrangementmodel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `courseName_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `termWeek_id` int(11) NOT NULL,
  `week_id` int(11) NOT NULL,
  `assistant_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `EXPS_arrangementmo_courseName_id_a7db611f_fk_EXPS_coursemodel_id` (`courseName_id`),
  KEY `EXPS_arrangementmodel_lesson_id_b441de67_fk_EXPS_lessonmodel_id` (`lesson_id`),
  KEY `EXPS_arrangementmo_termWeek_id_43afb157_fk_EXPS_termweekmodel_id` (`termWeek_id`),
  KEY `EXPS_arrangementmodel_week_id_ba624c42_fk_EXPS_weekmodel_id` (`week_id`),
  KEY `EXPS_arrangement_assistant_id_df92a2b2_fk_EXPS_assistantmodel_id` (`assistant_id`),
  KEY `EXPS_arrangementmodel_location_id_d0afc856_fk_EXPS_roommodel_id` (`location_id`),
  CONSTRAINT `EXPS_arrangement_assistant_id_df92a2b2_fk_EXPS_assistantmodel_id` FOREIGN KEY (`assistant_id`) REFERENCES `exps_assistantmodel` (`id`),
  CONSTRAINT `EXPS_arrangementmo_courseName_id_a7db611f_fk_EXPS_coursemodel_id` FOREIGN KEY (`courseName_id`) REFERENCES `exps_coursemodel` (`id`),
  CONSTRAINT `EXPS_arrangementmo_termWeek_id_43afb157_fk_EXPS_termweekmodel_id` FOREIGN KEY (`termWeek_id`) REFERENCES `exps_termweekmodel` (`id`),
  CONSTRAINT `EXPS_arrangementmodel_lesson_id_b441de67_fk_EXPS_lessonmodel_id` FOREIGN KEY (`lesson_id`) REFERENCES `exps_lessonmodel` (`id`),
  CONSTRAINT `EXPS_arrangementmodel_location_id_d0afc856_fk_EXPS_roommodel_id` FOREIGN KEY (`location_id`) REFERENCES `exps_roommodel` (`id`),
  CONSTRAINT `EXPS_arrangementmodel_week_id_ba624c42_fk_EXPS_weekmodel_id` FOREIGN KEY (`week_id`) REFERENCES `exps_weekmodel` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exps_arrangementmodel`
--

LOCK TABLES `exps_arrangementmodel` WRITE;
/*!40000 ALTER TABLE `exps_arrangementmodel` DISABLE KEYS */;
INSERT INTO `exps_arrangementmodel` VALUES (6,'TCP/IP原理',15,1,6,1,1,4),(7,'无线网络设备认知',16,1,6,1,1,4),(8,'简单无线局域网组建',16,1,6,2,1,4),(9,'OSPF路由实验',17,1,6,1,1,4),(10,'RIP实验',17,1,6,2,1,4),(11,'VLAN配置',17,1,6,3,1,4),(12,'TCP/IP原理',18,1,6,1,1,4),(13,'TCP/IP原理',19,1,6,1,1,4),(14,'TCP/IP原理',20,1,6,1,1,4),(15,'TCP/IP原理',21,1,6,1,1,4),(16,'TCP/IP原理',22,1,6,1,1,4),(17,'TCP/IP原理',23,1,6,1,1,4),(18,'TCP/IP原理',24,1,6,1,1,4),(19,'TCP/IP原理',25,1,6,1,1,4);
/*!40000 ALTER TABLE `exps_arrangementmodel` ENABLE KEYS */;
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

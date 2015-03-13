-- MySQL dump 10.13  Distrib 5.6.23, for osx10.8 (x86_64)
--
-- Host: localhost    Database: Sage
-- ------------------------------------------------------
-- Server version	5.6.23

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
-- Table structure for table `arrangement`
--

DROP TABLE IF EXISTS `arrangement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arrangement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `original_song_year` int(11) DEFAULT NULL,
  `quality` int(11) DEFAULT NULL,
  `genre` varchar(64) DEFAULT NULL,
  `nickname` varchar(16) DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `finale_url` varchar(255) DEFAULT NULL,
  `youtube_url` varchar(255) DEFAULT NULL,
  `arranged_semester_id` int(11) DEFAULT NULL,
  `reception` int(11) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `difficulty` int(11) DEFAULT NULL,
  `recording_url` varchar(255) DEFAULT NULL,
  `song_key` varchar(16) DEFAULT NULL,
  `pitch_blown` varchar(16) DEFAULT NULL,
  `number_of_parts` int(11) DEFAULT NULL,
  `solo_voice_part_id` int(11) DEFAULT NULL,
  `has_choreo` tinyint(1) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `has_syllables` tinyint(1) DEFAULT NULL,
  `artist_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrangement`
--

LOCK TABLES `arrangement` WRITE;
/*!40000 ALTER TABLE `arrangement` DISABLE KEYS */;
INSERT INTO `arrangement` VALUES (1,'Blue Skies',1926,5,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Softly and Tenderly Jesus is Calling',1901,1,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `arrangement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arrangement_arranger`
--

DROP TABLE IF EXISTS `arrangement_arranger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arrangement_arranger` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `arrangement_id` int(11) DEFAULT NULL,
  `hangover_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `arrangement_id` (`arrangement_id`,`hangover_id`),
  KEY `hangover_id` (`hangover_id`),
  CONSTRAINT `arrangement_arranger_ibfk_1` FOREIGN KEY (`arrangement_id`) REFERENCES `arrangement` (`id`),
  CONSTRAINT `arrangement_arranger_ibfk_2` FOREIGN KEY (`hangover_id`) REFERENCES `hangover` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrangement_arranger`
--

LOCK TABLES `arrangement_arranger` WRITE;
/*!40000 ALTER TABLE `arrangement_arranger` DISABLE KEYS */;
INSERT INTO `arrangement_arranger` VALUES (1,1,1);
/*!40000 ALTER TABLE `arrangement_arranger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arrangement_concert`
--

DROP TABLE IF EXISTS `arrangement_concert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arrangement_concert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `arrangement_id` int(11) DEFAULT NULL,
  `concert_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `arrangement_id` (`arrangement_id`,`concert_id`),
  KEY `concert_id` (`concert_id`),
  CONSTRAINT `arrangement_concert_ibfk_1` FOREIGN KEY (`arrangement_id`) REFERENCES `arrangement` (`id`),
  CONSTRAINT `arrangement_concert_ibfk_2` FOREIGN KEY (`concert_id`) REFERENCES `concert` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrangement_concert`
--

LOCK TABLES `arrangement_concert` WRITE;
/*!40000 ALTER TABLE `arrangement_concert` DISABLE KEYS */;
INSERT INTO `arrangement_concert` VALUES (1,1,1);
/*!40000 ALTER TABLE `arrangement_concert` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arrangement_semester`
--

DROP TABLE IF EXISTS `arrangement_semester`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arrangement_semester` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `arrangement_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `arrangement_id` (`arrangement_id`,`semester_id`),
  KEY `semester_id` (`semester_id`),
  CONSTRAINT `arrangement_semester_ibfk_1` FOREIGN KEY (`arrangement_id`) REFERENCES `arrangement` (`id`),
  CONSTRAINT `arrangement_semester_ibfk_2` FOREIGN KEY (`semester_id`) REFERENCES `semester` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrangement_semester`
--

LOCK TABLES `arrangement_semester` WRITE;
/*!40000 ALTER TABLE `arrangement_semester` DISABLE KEYS */;
/*!40000 ALTER TABLE `arrangement_semester` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arrangement_soloist`
--

DROP TABLE IF EXISTS `arrangement_soloist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arrangement_soloist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `arrangement_id` int(11) DEFAULT NULL,
  `hangover_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `arrangement_id` (`arrangement_id`,`hangover_id`),
  KEY `hangover_id` (`hangover_id`),
  CONSTRAINT `arrangement_soloist_ibfk_1` FOREIGN KEY (`arrangement_id`) REFERENCES `arrangement` (`id`),
  CONSTRAINT `arrangement_soloist_ibfk_2` FOREIGN KEY (`hangover_id`) REFERENCES `hangover` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrangement_soloist`
--

LOCK TABLES `arrangement_soloist` WRITE;
/*!40000 ALTER TABLE `arrangement_soloist` DISABLE KEYS */;
INSERT INTO `arrangement_soloist` VALUES (1,1,1);
/*!40000 ALTER TABLE `arrangement_soloist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arrangement_type`
--

DROP TABLE IF EXISTS `arrangement_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arrangement_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrangement_type`
--

LOCK TABLES `arrangement_type` WRITE;
/*!40000 ALTER TABLE `arrangement_type` DISABLE KEYS */;
INSERT INTO `arrangement_type` VALUES (1,'Handwritten Original'),(2,'Electronic'),(3,'Copy of Handwritten'),(4,'Copy of Electronic');
/*!40000 ALTER TABLE `arrangement_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `artist`
--

DROP TABLE IF EXISTS `artist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `artist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artist`
--

LOCK TABLES `artist` WRITE;
/*!40000 ALTER TABLE `artist` DISABLE KEYS */;
INSERT INTO `artist` VALUES (1,'Irving Berlin');
/*!40000 ALTER TABLE `artist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concert`
--

DROP TABLE IF EXISTS `concert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `concert_type_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concert`
--

LOCK TABLES `concert` WRITE;
/*!40000 ALTER TABLE `concert` DISABLE KEYS */;
INSERT INTO `concert` VALUES (1,'Fall Tonic I',1,1,'Statler Auditorium');
/*!40000 ALTER TABLE `concert` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concert_type`
--

DROP TABLE IF EXISTS `concert_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `concert_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concert_type`
--

LOCK TABLES `concert_type` WRITE;
/*!40000 ALTER TABLE `concert_type` DISABLE KEYS */;
INSERT INTO `concert_type` VALUES (1,'Fall Tonic'),(2,'Happy Hour'),(3,'Winter Concert');
/*!40000 ALTER TABLE `concert_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hangover`
--

DROP TABLE IF EXISTS `hangover`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hangover` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `renamed_to` varchar(255) DEFAULT NULL,
  `voice_part_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hangover`
--

LOCK TABLES `hangover` WRITE;
/*!40000 ALTER TABLE `hangover` DISABLE KEYS */;
INSERT INTO `hangover` VALUES (1,'H. Michael Newman',NULL,1);
/*!40000 ALTER TABLE `hangover` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hangover_concert`
--

DROP TABLE IF EXISTS `hangover_concert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hangover_concert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hangover_id` int(11) DEFAULT NULL,
  `concert_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hangover_id` (`hangover_id`,`concert_id`),
  KEY `concert_id` (`concert_id`),
  CONSTRAINT `hangover_concert_ibfk_1` FOREIGN KEY (`hangover_id`) REFERENCES `hangover` (`id`),
  CONSTRAINT `hangover_concert_ibfk_2` FOREIGN KEY (`concert_id`) REFERENCES `concert` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hangover_concert`
--

LOCK TABLES `hangover_concert` WRITE;
/*!40000 ALTER TABLE `hangover_concert` DISABLE KEYS */;
INSERT INTO `hangover_concert` VALUES (1,1,1);
/*!40000 ALTER TABLE `hangover_concert` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hangover_semester`
--

DROP TABLE IF EXISTS `hangover_semester`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hangover_semester` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hangover_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hangover_id` (`hangover_id`,`semester_id`),
  KEY `semester_id` (`semester_id`),
  CONSTRAINT `hangover_semester_ibfk_1` FOREIGN KEY (`hangover_id`) REFERENCES `hangover` (`id`),
  CONSTRAINT `hangover_semester_ibfk_2` FOREIGN KEY (`semester_id`) REFERENCES `semester` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hangover_semester`
--

LOCK TABLES `hangover_semester` WRITE;
/*!40000 ALTER TABLE `hangover_semester` DISABLE KEYS */;
INSERT INTO `hangover_semester` VALUES (1,1,1);
/*!40000 ALTER TABLE `hangover_semester` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semester`
--

DROP TABLE IF EXISTS `semester`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `semester` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `semester_type_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semester`
--

LOCK TABLES `semester` WRITE;
/*!40000 ALTER TABLE `semester` DISABLE KEYS */;
INSERT INTO `semester` VALUES (1,'Fall 1969',1969,1);
/*!40000 ALTER TABLE `semester` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semester_type`
--

DROP TABLE IF EXISTS `semester_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `semester_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semester_type`
--

LOCK TABLES `semester_type` WRITE;
/*!40000 ALTER TABLE `semester_type` DISABLE KEYS */;
INSERT INTO `semester_type` VALUES (1,'fall'),(2,'spring');
/*!40000 ALTER TABLE `semester_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voice_part`
--

DROP TABLE IF EXISTS `voice_part`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voice_part` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voice_part`
--

LOCK TABLES `voice_part` WRITE;
/*!40000 ALTER TABLE `voice_part` DISABLE KEYS */;
INSERT INTO `voice_part` VALUES (1,'Tenor I'),(2,'Tenor II'),(3,'Baritone'),(4,'Bass');
/*!40000 ALTER TABLE `voice_part` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-03-13 16:33:41

-- MySQL dump 10.13  Distrib 5.7.19, for macos10.12 (x86_64)
--
-- Host: localhost    Database: app_db
-- ------------------------------------------------------
-- Server version	5.7.19

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
-- Table structure for table `Drivers`
--

DROP TABLE IF EXISTS `Drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Drivers` (
  `id` int(11) NOT NULL,
  `current_long` double NOT NULL,
  `current_lat` double NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '0',
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `drivers_ibfk_1` FOREIGN KEY (`id`) REFERENCES `Users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Drivers`
--

-- LOCK TABLES `Drivers` WRITE;
-- /*!40000 ALTER TABLE `Drivers` DISABLE KEYS */;
-- INSERT INTO `Drivers` VALUES (1000,-121.88632860000001,37.3382082,1),(1001,-121.98857190000001,37.5482697,1),(1002,-122.04382980000003,37.5933918,1);
-- /*!40000 ALTER TABLE `Drivers` ENABLE KEYS */;
-- UNLOCK TABLES;

--
-- Table structure for table `PastRides`
--

DROP TABLE IF EXISTS `PastRides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PastRides` (
  `driverid` int(11) NOT NULL,
  `riderid` int(11) NOT NULL,
  `dest_long` double NOT NULL,
  `dest_lat` double NOT NULL,
  `start_long` double NOT NULL,
  `start_lat` double NOT NULL,
  `cost` double NOT NULL,
  `carpool` tinyint(1) NOT NULL,
  `time` int(11),
  PRIMARY KEY (`riderid`,`driverid`),
  CONSTRAINT `pastrides_ibfk_1` FOREIGN KEY (`riderid`) REFERENCES `USERS` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PastRides`
--

LOCK TABLES `PastRides` WRITE;
/*!40000 ALTER TABLE `PastRides` DISABLE KEYS */;
/*!40000 ALTER TABLE `PastRides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payments`
--

DROP TABLE IF EXISTS `Payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Payments` (
  `ID` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `cardNum` bigint(20) NOT NULL,
  `cvv` int(11) NOT NULL,
  `expMonth` int(11) NOT NULL,
  `expYear` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`cardNum`,`cvv`),
  KEY `ID` (`ID`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payments`
--

LOCK TABLES `Payments` WRITE;
/*!40000 ALTER TABLE `Payments` DISABLE KEYS */;
INSERT INTO `Payments` VALUES (1004,'VISA',4392030544827434,793,7,2018,'Natalie Lamberts'),(1007,'VISA',4539410161333375,404,9,2018,'Anthony Dyson'),(1005,'VISA',4556015500609282,743,12,2017,'Caleb Abramson'),(1003,'MASTERCARD',5391373268272736,920,6,2019,'Antonio Longman'),(1006,'MASTERCARD',5454984204534619,700,10,2018,'David Leman');
/*!40000 ALTER TABLE `Payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rides`
--

DROP TABLE IF EXISTS `Rides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Rides` (
  `driverid` int(11) NOT NULL,
  `riderid` int(11) NOT NULL,
  `dest_long` double NOT NULL,
  `dest_lat` double NOT NULL,
  `start_long` double NOT NULL,
  `start_lat` double NOT NULL,
  `cost` double NOT NULL,
  `carpool` tinyint(1) NOT NULL,
  `time` int(11) NOT NULL,
  PRIMARY KEY (`driverid`,`riderid`),
  KEY `riderid` (`riderid`),
  CONSTRAINT `rides_ibfk_1` FOREIGN KEY (`driverid`) REFERENCES `DRIVERS` (`id`),
  CONSTRAINT `rides_ibfk_2` FOREIGN KEY (`riderid`) REFERENCES `USERS` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rides`
--

LOCK TABLES `Rides` WRITE;
/*!40000 ALTER TABLE `Rides` DISABLE KEYS */;
/*!40000 ALTER TABLE `Rides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `phoneNumber` bigint(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `rider` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`,`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1009 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1000,'Christopher','Bush','chris',4822913475,'c@b.com',0),(1001,'Megan','Galbraith','megan',8242023342,'m@g.com',1),(1002,'Jennifer','Hailey','jennifer',4240142214,'j@h.com',1),(1003,'Antonio','Longman','antonio',4182194155,'a@l.com',0),(1004,'Natalie','Lamberts','natalie',9252404243,'n@l.com',0),(1005,'Caleb','Abramson','caleb',9320421432,'c@a.com',1),(1006,'David','Leman','david',401432143,'d@l.com',1),(1007,'Anthony','Dyson','anthony',855253212,'a@d.com',1),(1008,'Ariana','Bootman','ariana',953225123,'a@ba.com',0);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-11-07 23:30:35

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

LOCK TABLES `Drivers` WRITE;
/*!40000 ALTER TABLE `Drivers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Drivers` ENABLE KEYS */;
UNLOCK TABLES;

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
  `time` datetime NOT NULL,
  PRIMARY KEY (`riderid`,`time`),
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
  `time` datetime NOT NULL,
  PRIMARY KEY (`driverid`,`riderid`,`time`),
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
) ENGINE=InnoDB AUTO_INCREMENT=1003 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1000,'Christopher','Bush','chris',4822913475,'c@b.com',1),(1001,'Megan','Galbraith','megan',8242023342,'m@g.com',1),(1002,'Jennifer','Hailey','jennifer',4240142214,'j@h.com',1);
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

-- Dump completed on 2017-11-07  1:11:48

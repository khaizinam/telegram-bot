-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: dev_telegram
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `app_coinmarket`
--

DROP TABLE IF EXISTS `app_coinmarket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_coinmarket` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `coinid` char(255) NOT NULL COMMENT 'ID coin',
  `data_json` text COMMENT 'data lần gần nhất',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_coinmarket`
--

LOCK TABLES `app_coinmarket` WRITE;
/*!40000 ALTER TABLE `app_coinmarket` DISABLE KEYS */;
INSERT INTO `app_coinmarket` VALUES (1,'TON-USDT','{\"currentPrice\":3.05,\"high24h\":3.29,\"low24h\":3.039}','2025-08-29 09:50:52','2025-08-29 09:50:52'),(2,'TON-USDT','{\"currentPrice\":3.051,\"high24h\":3.29,\"low24h\":3.039}','2025-08-29 09:53:04','2025-08-29 09:53:04'),(3,'TON-USDT','{\"currentPrice\":3.06,\"high24h\":3.29,\"low24h\":3.039}','2025-08-29 11:05:22','2025-08-29 11:05:22');
/*!40000 ALTER TABLE `app_coinmarket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_market_notify`
--

DROP TABLE IF EXISTS `app_market_notify`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_market_notify` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `telegram_uid` varchar(255) NOT NULL,
  `chat_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `thread_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `coinid` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_market_notify`
--

LOCK TABLES `app_market_notify` WRITE;
/*!40000 ALTER TABLE `app_market_notify` DISABLE KEYS */;
INSERT INTO `app_market_notify` VALUES (2,'941864753','-1002931954066','117','2025-08-29 08:58:56','TON-USDT','active');
/*!40000 ALTER TABLE `app_market_notify` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_users`
--

DROP TABLE IF EXISTS `app_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'Telegram user id',
  `user_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `nickname` varchar(255) DEFAULT NULL,
  `last_hunt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_users`
--

LOCK TABLES `app_users` WRITE;
/*!40000 ALTER TABLE `app_users` DISABLE KEYS */;
INSERT INTO `app_users` VALUES (1,'941864753','khaizinam','2025-08-29 17:00:00','2025-08-29 17:00:00',NULL,'2025-08-29 10:00:00');
/*!40000 ALTER TABLE `app_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_pets`
--

DROP TABLE IF EXISTS `users_pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_pets` (
  `user_id` varchar(255) DEFAULT NULL,
  `pet_id` varchar(255) DEFAULT NULL,
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pet_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(255) DEFAULT NULL,
  `pet_info` text,
  `level` int DEFAULT '1',
  `exp_level` bigint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_pet_id` (`pet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_pets`
--

LOCK TABLES `users_pets` WRITE;
/*!40000 ALTER TABLE `users_pets` DISABLE KEYS */;
INSERT INTO `users_pets` VALUES ('941864753','leafbunny',1,'Leaf Bunny','2025-07-22 15:41:37','idle','{\"name\":\"Leaf Bunny\",\"element\":\"wood\",\"evol\":\"normal\",\"hp\":250,\"atk\":35,\"mag\":30,\"physic_def\":22,\"mag_def\":18,\"speed\":65,\"lvl_up\":{\"hp\":19,\"atk\":4,\"mag\":4,\"physic_def\":3,\"mag_def\":2,\"speed\":4},\"skill\":{\"name\":\"Nature Heal\",\"description\":\"Heals self over time.\",\"effects\":[{\"type\":\"heal\",\"target\":\"self\",\"amount\":30}]}}',1,0),('941864753','emberfox',2,'Ember Fox','2025-07-22 15:41:37','idle','{\"name\":\"Ember Fox\",\"element\":\"fire\",\"evol\":\"normal\",\"hp\":260,\"atk\":48,\"mag\":35,\"physic_def\":18,\"mag_def\":12,\"speed\":70,\"lvl_up\":{\"hp\":20,\"atk\":6,\"mag\":4,\"physic_def\":3,\"mag_def\":2,\"speed\":5},\"skill\":{\"name\":\"Fire Fang\",\"description\":\"Deals physical damage based on atk.\",\"effects\":[{\"type\":\"direct\",\"scaleType\":\"atk\",\"scale\":1.5,\"damageType\":\"physical\"}]}}',1,0),('941864753','raindeer',3,'Rain Deer','2025-07-22 15:41:37','idle','{\"name\":\"Rain Deer\",\"element\":\"water\",\"evol\":\"normal\",\"hp\":300,\"atk\":28,\"mag\":42,\"physic_def\":20,\"mag_def\":32,\"speed\":50,\"lvl_up\":{\"hp\":22,\"atk\":3,\"mag\":5,\"physic_def\":2,\"mag_def\":4,\"speed\":3},\"skill\":{\"name\":\"Aqua Shield\",\"description\":\"Creates a magic barrier.\",\"effects\":[{\"type\":\"shield\",\"target\":\"self\",\"amount\":35,\"duration\":2}]}}',1,0),('941864753','vineboar',4,'Vine Boar','2025-07-22 16:18:51','idle','{\"name\":\"Vine Boar\",\"element\":\"wood\",\"evol\":\"normal\",\"hp\":270,\"atk\":44,\"mag\":25,\"physic_def\":26,\"mag_def\":20,\"speed\":55,\"lvl_up\":{\"hp\":21,\"atk\":5,\"mag\":3,\"physic_def\":3,\"mag_def\":3,\"speed\":3},\"skill\":{\"name\":\"Thorn Slam\",\"description\":\"Deals physical damage and slows enemy.\",\"effects\":[{\"type\":\"status\",\"effect_type\":\"slow\",\"duration\":2}]}}',1,0),('941864753','windbird',5,'Wind Bird','2025-07-22 16:18:51','idle','{\"name\":\"Wind Bird\",\"element\":\"air\",\"evol\":\"normal\",\"hp\":200,\"atk\":42,\"mag\":28,\"physic_def\":18,\"mag_def\":15,\"speed\":85,\"lvl_up\":{\"hp\":16,\"atk\":5,\"mag\":3,\"physic_def\":2,\"mag_def\":2,\"speed\":6},\"skill\":{\"name\":\"Gale Slice\",\"description\":\"Hits with a fast wind attack.\",\"effects\":[{\"type\":\"direct\",\"scaleType\":\"atk\",\"scale\":1.4,\"damageType\":\"physical\"}]}}',1,0),('941864753','aquamouse',6,'Aqua Mouse','2025-07-22 16:18:51','idle','{\"name\":\"Aqua Mouse\",\"element\":\"water\",\"evol\":\"normal\",\"hp\":220,\"atk\":30,\"mag\":50,\"physic_def\":15,\"mag_def\":25,\"speed\":60,\"lvl_up\":{\"hp\":18,\"atk\":3,\"mag\":6,\"physic_def\":2,\"mag_def\":4,\"speed\":4},\"skill\":{\"name\":\"Water Jet\",\"description\":\"Deals magical damage.\",\"effects\":[{\"type\":\"direct\",\"scaleType\":\"mag\",\"scale\":1.3,\"damageType\":\"magical\"}]}}',1,0),('941864753','flamesnake',7,'Flame Snake','2025-08-29 09:38:34','idle','{\"name\":\"Flame Snake\",\"element\":\"fire\",\"evol\":\"normal\",\"hp\":230,\"atk\":45,\"mag\":35,\"physic_def\":17,\"mag_def\":12,\"speed\":75,\"lvl_up\":{\"hp\":17,\"atk\":5,\"mag\":4,\"physic_def\":2,\"mag_def\":2,\"speed\":5},\"skill\":{\"name\":\"Scorch\",\"description\":\"Applies burn damage over time.\",\"effects\":[{\"type\":\"dot\",\"effect_type\":\"burn\",\"damagePerTurn\":20,\"duration\":3}]}}',1,0),('941864753','windbird',8,'Wind Bird','2025-08-29 09:38:34','idle','{\"name\":\"Wind Bird\",\"element\":\"air\",\"evol\":\"normal\",\"hp\":200,\"atk\":42,\"mag\":28,\"physic_def\":18,\"mag_def\":15,\"speed\":85,\"lvl_up\":{\"hp\":16,\"atk\":5,\"mag\":3,\"physic_def\":2,\"mag_def\":2,\"speed\":6},\"skill\":{\"name\":\"Gale Slice\",\"description\":\"Hits with a fast wind attack.\",\"effects\":[{\"type\":\"direct\",\"scaleType\":\"atk\",\"scale\":1.4,\"damageType\":\"physical\"}]}}',1,0),('941864753','leafbunny',9,'Leaf Bunny','2025-08-29 09:38:34','idle','{\"name\":\"Leaf Bunny\",\"element\":\"wood\",\"evol\":\"normal\",\"hp\":250,\"atk\":35,\"mag\":30,\"physic_def\":22,\"mag_def\":18,\"speed\":65,\"lvl_up\":{\"hp\":19,\"atk\":4,\"mag\":4,\"physic_def\":3,\"mag_def\":2,\"speed\":4},\"skill\":{\"name\":\"Nature Heal\",\"description\":\"Heals self over time.\",\"effects\":[{\"type\":\"heal\",\"target\":\"self\",\"amount\":30}]}}',1,0),('941864753','raindeer',10,'Rain Deer','2025-08-29 17:00:00','idle','{\"name\":\"Rain Deer\",\"element\":\"water\",\"evol\":\"normal\",\"hp\":300,\"atk\":28,\"mag\":42,\"physic_def\":20,\"mag_def\":32,\"speed\":50,\"lvl_up\":{\"hp\":22,\"atk\":3,\"mag\":5,\"physic_def\":2,\"mag_def\":4,\"speed\":3},\"skill\":{\"name\":\"Aqua Shield\",\"description\":\"Creates a magic barrier.\",\"effects\":[{\"type\":\"shield\",\"target\":\"self\",\"amount\":35,\"duration\":2}]}}',1,0),('941864753','rockhog',11,'Rock Hog','2025-08-29 17:00:00','idle','{\"name\":\"Rock Hog\",\"element\":\"earth\",\"evol\":\"normal\",\"hp\":340,\"atk\":40,\"mag\":20,\"physic_def\":45,\"mag_def\":30,\"speed\":20,\"lvl_up\":{\"hp\":25,\"atk\":4,\"mag\":2,\"physic_def\":6,\"mag_def\":3,\"speed\":1},\"skill\":{\"name\":\"Stone Skin\",\"description\":\"Increases physical defense.\",\"effects\":[{\"type\":\"buff\",\"buff_target\":\"self\",\"buff_type\":\"physic_def\",\"amount\":20,\"duration\":3}]}}',1,0),('941864753','leafbunny',12,'Leaf Bunny','2025-08-29 17:00:00','idle','{\"name\":\"Leaf Bunny\",\"element\":\"wood\",\"evol\":\"normal\",\"hp\":250,\"atk\":35,\"mag\":30,\"physic_def\":22,\"mag_def\":18,\"speed\":65,\"lvl_up\":{\"hp\":19,\"atk\":4,\"mag\":4,\"physic_def\":3,\"mag_def\":2,\"speed\":4},\"skill\":{\"name\":\"Nature Heal\",\"description\":\"Heals self over time.\",\"effects\":[{\"type\":\"heal\",\"target\":\"self\",\"amount\":30}]}}',1,0);
/*!40000 ALTER TABLE `users_pets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-29 18:21:08

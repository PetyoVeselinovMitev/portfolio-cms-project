-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: komtekst
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `components`
--

DROP TABLE IF EXISTS `components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `container_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `content_bg` json DEFAULT NULL,
  `content_en` json DEFAULT NULL,
  `order_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `container_id` (`container_id`),
  CONSTRAINT `components_ibfk_1` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1331 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `components`
--

LOCK TABLES `components` WRITE;
/*!40000 ALTER TABLE `components` DISABLE KEYS */;
INSERT INTO `components` VALUES (1328,468,'TextBox','{\"text\": \"<p style=\\\"text-align: center\\\">сдфсдф</p>\"}','null',1),(1329,468,'Empty',NULL,NULL,2),(1330,468,'Empty',NULL,NULL,3);
/*!40000 ALTER TABLE `components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `containers`
--

DROP TABLE IF EXISTS `containers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `containers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `route_id` int NOT NULL,
  `order_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `route_id` (`route_id`),
  CONSTRAINT `containers_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=469 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `containers`
--

LOCK TABLES `containers` WRITE;
/*!40000 ALTER TABLE `containers` DISABLE KEYS */;
INSERT INTO `containers` VALUES (468,95,1);
/*!40000 ALTER TABLE `containers` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`komtekst`@`%`*/ /*!50003 TRIGGER `auto_increment_order_id` BEFORE INSERT ON `containers` FOR EACH ROW BEGIN
    DECLARE max_order_id INT;

    -- Find the highest order_id for the given route_id
    SELECT COALESCE(MAX(order_id), 0)
    INTO max_order_id
    FROM Containers
    WHERE route_id = NEW.route_id;

    -- Set the new order_id
    SET NEW.order_id = max_order_id + 1;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `name_bg` varchar(255) DEFAULT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `order_id` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `path_UNIQUE` (`path`),
  UNIQUE KEY `name_UNIQUE` (`name_bg`),
  UNIQUE KEY `name_en_UNIQUE` (`name_en`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (95,'/test','test','test',1);
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`komtekst`@`%`*/ /*!50003 TRIGGER `before_insert_routes` BEFORE INSERT ON `routes` FOR EACH ROW BEGIN
    DECLARE max_order INT;
    SELECT IFNULL(MAX(order_id), 0) INTO max_order FROM routes;
    SET NEW.order_id = max_order + 1;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `otp_secret` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,'adm','$2a$10$nLE0QFLyI8Bq7slrNA6N4.hAuWnmZ8rEw0EjqKnzsqZOyRbjyLx4m','N5HU4LBPIAYHUQLQJFOWISLLLVKFGIJVLASTSNCSIREGQL2PKRUQ'),(38,'test','$2a$10$hqGUgsYV.5lR1EUUEpSp8OQEYTmOytZXjWpPaLP.irbwXsupFboIy','HBDVCOKJGN5UITTLM55CGYKTK5REY4ZW'),(39,'komtekst-admin','$2a$10$er2prYELYjthgZdurKyQguVOnW95HeTEOMADdwbSXollwDN/ayLla','J55FIUJMGZRTW22WMI7F4QCGO5AFMP2H');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'komtekst'
--

--
-- Dumping routines for database 'komtekst'
--
/*!50003 DROP PROCEDURE IF EXISTS `AdjustOrderId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`komtekst`@`%` PROCEDURE `AdjustOrderId`()
BEGIN
    DECLARE current_order INT DEFAULT 1;
    DECLARE done INT DEFAULT 0;
    DECLARE route_id INT;

    -- Declare a cursor for selecting the routes in order of their current order_id
    DECLARE route_cursor CURSOR FOR
        SELECT id FROM routes ORDER BY order_id;

    -- Declare a handler for when the cursor has finished looping
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Open the cursor
    OPEN route_cursor;

    -- Loop through all rows and update the order_id sequentially
    read_loop: LOOP
        FETCH route_cursor INTO route_id;
        
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Update the order_id sequentially
        UPDATE routes
        SET order_id = current_order
        WHERE id = route_id;

        -- Increment the current_order for the next row
        SET current_order = current_order + 1;
    END LOOP;

    -- Close the cursor
    CLOSE route_cursor;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ChangeRouteOrder` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`komtekst`@`%` PROCEDURE `ChangeRouteOrder`(IN route_id INT, IN new_order_id INT)
BEGIN
    DECLARE current_order_id INT;
    
    -- Get the current order of the route
    SELECT order_id INTO current_order_id
    FROM routes
    WHERE id = route_id;
    
    -- If the new order is greater than the current order, update the order of routes in between
    IF new_order_id > current_order_id THEN
        UPDATE routes
        SET order_id = order_id - 1
        WHERE order_id > current_order_id AND order_id <= new_order_id;
    -- If the new order is less than the current order, update the order of routes in between
    ELSE
        UPDATE routes
        SET order_id = order_id + 1
        WHERE order_id < current_order_id AND order_id >= new_order_id;
    END IF;
    
    -- Update the route's order_id
    UPDATE routes
    SET order_id = new_order_id
    WHERE id = route_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ShiftOrderDown` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`komtekst`@`%` PROCEDURE `ShiftOrderDown`(IN containerId INT)
BEGIN
    DECLARE currentRouteId INT;
    DECLARE currentOrderId INT;
    DECLARE targetContainerId INT;

    -- Get the current route_id and order_id of the container
    SELECT route_id, order_id INTO currentRouteId, currentOrderId
    FROM containers
    WHERE id = containerId;

    -- Find the container with the same route_id and the order_id immediately below
    SELECT id INTO targetContainerId
    FROM containers
    WHERE route_id = currentRouteId AND order_id = currentOrderId + 1
    LIMIT 1;

    -- Swap the order_ids of the two containers
    IF targetContainerId IS NOT NULL THEN
        UPDATE containers 
        SET order_id = currentOrderId + 1 
        WHERE id = containerId;

        UPDATE containers 
        SET order_id = currentOrderId 
        WHERE id = targetContainerId;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ShiftOrderUp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`komtekst`@`%` PROCEDURE `ShiftOrderUp`(IN containerId INT)
BEGIN
    DECLARE currentRouteId INT;
    DECLARE currentOrderId INT;
    DECLARE targetContainerId INT;

    -- Get the current route_id and order_id of the container
    SELECT route_id, order_id INTO currentRouteId, currentOrderId
    FROM containers
    WHERE id = containerId;

    -- Find the container with the same route_id and the order_id immediately above
    SELECT id INTO targetContainerId
    FROM containers
    WHERE route_id = currentRouteId AND order_id = currentOrderId - 1
    LIMIT 1;

    -- Swap the order_ids of the two containers
    IF targetContainerId IS NOT NULL THEN
        UPDATE containers 
        SET order_id = currentOrderId - 1 
        WHERE id = containerId;

        UPDATE containers 
        SET order_id = currentOrderId 
        WHERE id = targetContainerId;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SwapRouteOrder` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`komtekst`@`%` PROCEDURE `SwapRouteOrder`(IN current_order_id INT)
BEGIN
    -- Declare variables to hold the current and next order ids
    DECLARE next_order_id INT;

    -- Fetch the next order_id
    SELECT order_id INTO next_order_id
    FROM routes
    WHERE order_id = current_order_id + 1;

    -- If the next order exists
    IF next_order_id IS NOT NULL THEN
        -- Perform the swap between current and next order_id
        UPDATE routes
        SET order_id = -1
        WHERE order_id = current_order_id; -- Temporarily mark current route

        UPDATE routes
        SET order_id = current_order_id
        WHERE order_id = next_order_id; -- Update next route with current order_id

        UPDATE routes
        SET order_id = next_order_id
        WHERE order_id = -1; -- Now update current route with next order_id
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SwapRouteOrderWithLower` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`komtekst`@`%` PROCEDURE `SwapRouteOrderWithLower`(IN current_order_id INT)
BEGIN
    -- Declare variable to hold the previous order_id
    DECLARE prev_order_id INT;

    -- Fetch the previous order_id
    SELECT order_id INTO prev_order_id
    FROM routes
    WHERE order_id = current_order_id - 1;

    -- If the previous order exists (i.e., current_order_id is not the first route)
    IF prev_order_id IS NOT NULL THEN
        -- Temporarily mark the current route by setting its order_id to a placeholder value (-1)
        UPDATE routes
        SET order_id = -1
        WHERE order_id = current_order_id;

        -- Update the previous route's order_id to the current route's order_id
        UPDATE routes
        SET order_id = current_order_id
        WHERE order_id = prev_order_id;

        -- Restore the current route's order_id with the previous route's order_id
        UPDATE routes
        SET order_id = prev_order_id
        WHERE order_id = -1;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateOrderIds` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`komtekst`@`%` PROCEDURE `UpdateOrderIds`()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE route INT;
    DECLARE cur CURSOR FOR 
        SELECT DISTINCT route_id FROM containers;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Open the cursor
    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO route;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Drop the temporary table if it already exists
        DROP TEMPORARY TABLE IF EXISTS temp_rank;

        -- Create a temporary table to calculate new order IDs
        CREATE TEMPORARY TABLE temp_rank AS
        SELECT id, ROW_NUMBER() OVER (ORDER BY order_id) AS new_order_id
        FROM containers
        WHERE route_id = route;

        -- Update the table with the new order IDs
        UPDATE containers
        JOIN temp_rank
        ON containers.id = temp_rank.id
        SET containers.order_id = temp_rank.new_order_id;

        -- Drop the temporary table after use
        DROP TEMPORARY TABLE temp_rank;
    END LOOP;

    -- Close the cursor
    CLOSE cur;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-17 16:40:10

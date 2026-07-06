-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: warmindo_p3k
-- ------------------------------------------------------
-- Server version	8.4.3

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
-- Table structure for table `bahan_baku`
--

DROP TABLE IF EXISTS `bahan_baku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bahan_baku` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `satuan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stok_saat_ini` decimal(12,3) NOT NULL DEFAULT '0.000',
  `stok_minimum` decimal(12,3) NOT NULL DEFAULT '0.000',
  `is_rokok` tinyint(1) NOT NULL DEFAULT '0',
  `isi_per_bungkus` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `jenis` enum('produk','non_produk') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'produk',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bahan_baku_sku_unique` (`sku`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bahan_baku`
--

LOCK TABLES `bahan_baku` WRITE;
/*!40000 ALTER TABLE `bahan_baku` DISABLE KEYS */;
INSERT INTO `bahan_baku` VALUES (1,'RMDG000001','MIE INDOMIE GORENG ORIGINAL','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:20:04','2026-07-04 12:50:45'),(2,'RMDG000002','MIE INDOMIE KUAH SOTO','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:21:13','2026-07-04 12:51:05'),(3,'RMDG000003','MIE INDOMIE KUAH KARI AYAM','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:21:34','2026-07-04 12:51:26'),(4,'RMDG000004','MIE INDOMIE KUAH AYAM BAWANG','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:22:02','2026-07-04 12:51:41'),(5,'RMDG000005','MIE INDOMIE GORENG RENDANG','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:22:29','2026-07-04 12:51:52'),(6,'RMDG000006','MIE SEDAP GORENG ORIGINAL','pcs',0.000,0.000,0,NULL,1,'produk','2026-07-04 12:25:09','2026-07-04 12:52:10'),(7,'RMDG000007','MIE SEDAP KUAH SOTO KOYA','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:27:46','2026-07-04 12:52:21'),(8,'RMBV000001','KOPI KAPAL API HITAM SPECIAL MIX','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:31:25','2026-07-04 12:52:47'),(9,'RMBV000002','KOPI KAPAL API HITAM GULA AREN','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:32:01','2026-07-04 12:53:02'),(10,'RMBV000003','KOPI INDOCAFE COFFEEMIX','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:33:08','2026-07-04 12:53:44'),(11,'RMBV000004','KOPI ABC SUSU','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:36:56','2026-07-04 12:53:58'),(12,'RMBV000005','KOPI ABC MOCCA','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:37:16','2026-07-04 12:54:08'),(13,'RMBV000006','KOPI LIONG HITAM GULA','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:39:32','2026-07-04 12:54:23'),(14,'RMBV000007','KOPI LIONG HITAM TANPA GULA','gram',0.000,0.000,0,NULL,1,'produk','2026-07-04 12:42:57','2026-07-04 12:54:39'),(15,'RMBV000008','KOPI LUWAK WHITE COFFEE','pcs',0.000,0.000,0,NULL,1,'produk','2026-07-04 12:44:50','2026-07-04 12:54:58'),(16,'RMBV000009','KOPI GOOD DAY CAPPUCCINO','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:45:45','2026-07-04 12:55:15'),(17,'RMBV000010','KOPI GOOD DAY MOCACINNO','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:46:50','2026-07-04 12:55:29'),(18,'RMBV000011','KOPI GOOD DAY CHOCOCINNO','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:48:04','2026-07-04 12:55:42'),(19,'RMBV000012','KOPI GOOD DAY VANILLA LATTE','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:49:07','2026-07-04 12:55:57'),(20,'RMBV000013','KOPI GOOD DAY CARREBIAN NUT','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:50:01','2026-07-04 12:56:11'),(21,'RMBV000014','TEH MAX TEA TARIK','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:57:03','2026-07-04 12:57:03'),(22,'RMBV000015','TEH TONG TJI ORIGINAL CELUP','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 12:58:27','2026-07-04 13:02:18'),(23,'RMBV000016','TEH CAP BOTOL TUBRUK','gram',0.000,0.000,0,NULL,1,'produk','2026-07-04 12:58:56','2026-07-04 13:03:41'),(24,'RMBV000017','POP ICE MANGO','pcs',0.000,0.000,0,NULL,1,'produk','2026-07-04 13:04:33','2026-07-04 13:04:33'),(25,'RMBV000018','POP ICE VANILLA BLUE','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:05:02','2026-07-04 13:05:02'),(26,'RMBV000019','POP ICE DURIAN','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:05:30','2026-07-04 13:05:30'),(27,'RMBV000020','POP ICE AVOCADO','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:05:59','2026-07-04 13:05:59'),(28,'RMBV000021','POP ICE CAPPUCCINO','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:06:29','2026-07-04 13:06:29'),(29,'RMBV000022','POP ICE CHOCO COOKIES','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:06:55','2026-07-04 13:06:55'),(30,'RMBV000023','POP ICE GRAPE','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:07:21','2026-07-04 13:07:21'),(31,'RMBV000024','POP ICE MATCHA CARAMEL LATTE','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:07:55','2026-07-04 13:07:55'),(32,'RMBV000025','POP ICE MILKY BROWN SUGAR','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:08:34','2026-07-04 13:08:34'),(33,'RMBV000026','POP ICE THUNDER CHOCO MALT','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:09:12','2026-07-04 13:09:12'),(34,'RMBV000027','NUTRISARI ANGGUR','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:10:07','2026-07-04 13:10:07'),(35,'RMBV000028','NUTRISARI JERUK MANIS','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:10:36','2026-07-04 13:10:36'),(36,'RMBV000029','NUTRISARI FLORIDA ORANGE','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:11:01','2026-07-04 13:11:01'),(37,'RMBV000030','NUTRISARI SWEET MANGO','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:11:35','2026-07-04 13:11:35'),(38,'RMBV000031','NUTRISARI JERUK PERAS','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:12:05','2026-07-04 13:12:05'),(39,'RMBV000032','NUTRISARI SWEET ORANGE','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:12:35','2026-07-04 13:12:35'),(40,'RMBV000033','NUTRISARI SWEET GUAVA','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:13:07','2026-07-04 13:13:07'),(41,'RMBV000034','SUSU DANCOW COKELAT BUBUK','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:14:39','2026-07-04 13:14:39'),(42,'RMBV000035','SUSU DANCOW VANILLA BUBUK','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:15:02','2026-07-04 13:15:02'),(43,'RMBV000036','TEH PUCUK','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:15:30','2026-07-04 13:15:30'),(44,'RMBV000037','AIR MINERAL LE MINERALE','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:16:21','2026-07-04 13:16:21'),(45,'RMDG000008','TELUR AYAM','pcs',0.000,5.000,0,NULL,1,'produk','2026-07-04 13:18:16','2026-07-04 13:18:16'),(46,'RMOT000001','ROKOK GUDANG GARAM INTERNATIONAL','bungkus',0.000,0.000,1,12,1,'produk','2026-07-04 13:21:18','2026-07-04 13:21:18'),(47,'RMOT000002','ROKOK DJARUM SUPER','bungkus',0.000,0.000,1,12,1,'produk','2026-07-04 13:21:55','2026-07-04 13:21:55'),(48,'RMOT000003','ROKOK SAMPOERNA MILD','bungkus',0.000,0.000,1,16,1,'produk','2026-07-04 13:22:37','2026-07-04 13:22:37'),(49,'RMOT000004','ROKOK DJI SAM SOE MAGNUM FILTER','bungkus',0.000,0.000,1,12,1,'produk','2026-07-04 13:23:33','2026-07-04 13:23:33'),(50,'RMOT000005','ROKOK DJI SAM SOE KRETEK','bungkus',0.000,0.000,1,12,1,'produk','2026-07-04 13:26:35','2026-07-04 13:26:35'),(51,'RMAS000001','TELEVISI','pcs',0.000,0.000,0,NULL,1,'non_produk','2026-07-04 13:28:08','2026-07-04 13:28:08'),(52,'RMAS000002','SPEAKER','pcs',0.000,0.000,0,NULL,1,'non_produk','2026-07-04 13:28:31','2026-07-04 13:28:31'),(53,'RMAS000003','KIPAS ANGIN','pcs',0.000,0.000,0,NULL,1,'non_produk','2026-07-04 13:28:57','2026-07-04 13:28:57'),(54,'RMAS000004','GEROBAK','pcs',0.000,0.000,0,NULL,1,'non_produk','2026-07-04 13:29:19','2026-07-04 13:29:19'),(55,'RMAS000005','MEJA KAYU PERSEGI PANJANG','pcs',0.000,0.000,0,NULL,1,'non_produk','2026-07-04 13:29:50','2026-07-04 13:29:50'),(56,'RMAS000006','MEJA KAYU PERSEGI','pcs',0.000,0.000,0,NULL,1,'non_produk','2026-07-04 13:30:27','2026-07-04 13:30:57'),(57,'RMAS000007','KURSI PLASTIK','pcs',0.000,0.000,0,NULL,1,'non_produk','2026-07-04 13:30:47','2026-07-04 13:30:47'),(58,'RMVG000001','SAWI HIJAU','gram',0.000,0.000,0,NULL,1,'produk','2026-07-04 13:32:11','2026-07-04 13:32:11');
/*!40000 ALTER TABLE `bahan_baku` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_non_sales`
--

DROP TABLE IF EXISTS `detail_non_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_non_sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `non_sales_id` bigint unsigned NOT NULL,
  `produk_id` bigint unsigned DEFAULT NULL,
  `bahan_baku_id` bigint unsigned DEFAULT NULL,
  `jumlah` decimal(12,3) NOT NULL,
  `hpp_satuan` decimal(15,2) NOT NULL,
  `subtotal_hpp` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `detail_non_sales_non_sales_id_foreign` (`non_sales_id`),
  KEY `detail_non_sales_produk_id_foreign` (`produk_id`),
  KEY `detail_non_sales_bahan_baku_id_foreign` (`bahan_baku_id`),
  CONSTRAINT `detail_non_sales_bahan_baku_id_foreign` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_baku` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `detail_non_sales_non_sales_id_foreign` FOREIGN KEY (`non_sales_id`) REFERENCES `non_sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detail_non_sales_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_non_sales`
--

LOCK TABLES `detail_non_sales` WRITE;
/*!40000 ALTER TABLE `detail_non_sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_non_sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_pembelian`
--

DROP TABLE IF EXISTS `detail_pembelian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_pembelian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pembelian_id` bigint unsigned NOT NULL,
  `bahan_baku_id` bigint unsigned NOT NULL,
  `jumlah` decimal(12,3) NOT NULL,
  `harga_satuan` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `detail_pembelian_pembelian_id_foreign` (`pembelian_id`),
  KEY `detail_pembelian_bahan_baku_id_foreign` (`bahan_baku_id`),
  CONSTRAINT `detail_pembelian_bahan_baku_id_foreign` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_baku` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `detail_pembelian_pembelian_id_foreign` FOREIGN KEY (`pembelian_id`) REFERENCES `pembelian` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_pembelian`
--

LOCK TABLES `detail_pembelian` WRITE;
/*!40000 ALTER TABLE `detail_pembelian` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_pembelian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_promo`
--

DROP TABLE IF EXISTS `detail_promo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_promo` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `promo_id` bigint unsigned NOT NULL,
  `produk_id` bigint unsigned NOT NULL,
  `harga_promo` decimal(15,2) DEFAULT NULL,
  `diskon_persen` decimal(5,2) DEFAULT NULL,
  `min_beli` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `detail_promo_promo_id_foreign` (`promo_id`),
  KEY `detail_promo_produk_id_foreign` (`produk_id`),
  CONSTRAINT `detail_promo_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detail_promo_promo_id_foreign` FOREIGN KEY (`promo_id`) REFERENCES `promo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_promo`
--

LOCK TABLES `detail_promo` WRITE;
/*!40000 ALTER TABLE `detail_promo` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_promo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_resep`
--

DROP TABLE IF EXISTS `detail_resep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_resep` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produk_id` bigint unsigned NOT NULL,
  `bahan_baku_id` bigint unsigned NOT NULL,
  `jumlah` decimal(12,3) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `detail_resep_produk_id_bahan_baku_id_unique` (`produk_id`,`bahan_baku_id`),
  KEY `detail_resep_bahan_baku_id_foreign` (`bahan_baku_id`),
  CONSTRAINT `detail_resep_bahan_baku_id_foreign` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_baku` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `detail_resep_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_resep`
--

LOCK TABLES `detail_resep` WRITE;
/*!40000 ALTER TABLE `detail_resep` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_resep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_stock_opname`
--

DROP TABLE IF EXISTS `detail_stock_opname`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_stock_opname` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stock_opname_id` bigint unsigned NOT NULL,
  `bahan_baku_id` bigint unsigned NOT NULL,
  `stok_sistem` decimal(12,3) NOT NULL,
  `stok_fisik` decimal(12,3) NOT NULL,
  `selisih` decimal(12,3) NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `detail_stock_opname_stock_opname_id_foreign` (`stock_opname_id`),
  KEY `detail_stock_opname_bahan_baku_id_foreign` (`bahan_baku_id`),
  CONSTRAINT `detail_stock_opname_bahan_baku_id_foreign` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_baku` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `detail_stock_opname_stock_opname_id_foreign` FOREIGN KEY (`stock_opname_id`) REFERENCES `stock_opname` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_stock_opname`
--

LOCK TABLES `detail_stock_opname` WRITE;
/*!40000 ALTER TABLE `detail_stock_opname` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_stock_opname` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_transaksi`
--

DROP TABLE IF EXISTS `detail_transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_transaksi` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaksi_id` bigint unsigned NOT NULL,
  `produk_id` bigint unsigned NOT NULL,
  `promo_id` bigint unsigned DEFAULT NULL,
  `jumlah` int NOT NULL,
  `harga_normal_satuan` decimal(15,2) NOT NULL,
  `harga_jual_satuan` decimal(15,2) NOT NULL,
  `hpp_satuan` decimal(15,2) NOT NULL,
  `subtotal_harga_jual` decimal(15,2) NOT NULL,
  `subtotal_hpp` decimal(15,2) NOT NULL,
  `subtotal_dana_modal` decimal(15,2) NOT NULL,
  `subtotal_dana_operasional` decimal(15,2) NOT NULL,
  `subtotal_keuntungan` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `detail_transaksi_transaksi_id_foreign` (`transaksi_id`),
  KEY `detail_transaksi_produk_id_foreign` (`produk_id`),
  KEY `detail_transaksi_promo_id_foreign` (`promo_id`),
  CONSTRAINT `detail_transaksi_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produk` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `detail_transaksi_promo_id_foreign` FOREIGN KEY (`promo_id`) REFERENCES `promo` (`id`) ON DELETE SET NULL,
  CONSTRAINT `detail_transaksi_transaksi_id_foreign` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_transaksi`
--

LOCK TABLES `detail_transaksi` WRITE;
/*!40000 ALTER TABLE `detail_transaksi` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_transaksi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dompet_keuangan`
--

DROP TABLE IF EXISTS `dompet_keuangan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dompet_keuangan` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tipe` enum('modal','operasional','keuntungan') COLLATE utf8mb4_unicode_ci NOT NULL,
  `saldo` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dompet_keuangan_tipe_unique` (`tipe`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dompet_keuangan`
--

LOCK TABLES `dompet_keuangan` WRITE;
/*!40000 ALTER TABLE `dompet_keuangan` DISABLE KEYS */;
INSERT INTO `dompet_keuangan` VALUES (1,'modal',0.00,'2026-07-03 11:44:54','2026-07-03 11:44:54'),(2,'operasional',0.00,'2026-07-03 11:44:54','2026-07-03 11:44:54'),(3,'keuntungan',0.00,'2026-07-03 11:44:54','2026-07-03 11:44:54');
/*!40000 ALTER TABLE `dompet_keuangan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fifo_batches`
--

DROP TABLE IF EXISTS `fifo_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fifo_batches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bahan_baku_id` bigint unsigned NOT NULL,
  `pembelian_id` bigint unsigned DEFAULT NULL,
  `harga_beli` decimal(15,2) NOT NULL,
  `jumlah_awal` decimal(12,3) NOT NULL,
  `jumlah_sisa` decimal(12,3) NOT NULL,
  `tanggal_masuk` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fifo_batches_pembelian_id_foreign` (`pembelian_id`),
  KEY `fifo_batches_bahan_baku_id_tanggal_masuk_index` (`bahan_baku_id`,`tanggal_masuk`),
  CONSTRAINT `fifo_batches_bahan_baku_id_foreign` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_baku` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fifo_batches_pembelian_id_foreign` FOREIGN KEY (`pembelian_id`) REFERENCES `pembelian` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fifo_batches`
--

LOCK TABLES `fifo_batches` WRITE;
/*!40000 ALTER TABLE `fifo_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `fifo_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hutang_supplier`
--

DROP TABLE IF EXISTS `hutang_supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hutang_supplier` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pembelian_id` bigint unsigned NOT NULL,
  `supplier_id` bigint unsigned DEFAULT NULL,
  `jumlah_hutang` decimal(15,2) NOT NULL,
  `jumlah_bayar` decimal(15,2) NOT NULL DEFAULT '0.00',
  `sisa_hutang` decimal(15,2) NOT NULL,
  `status` enum('belum_lunas','lunas') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'belum_lunas',
  `tanggal_hutang` date NOT NULL,
  `tanggal_lunas` date DEFAULT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hutang_supplier_pembelian_id_foreign` (`pembelian_id`),
  KEY `hutang_supplier_supplier_id_foreign` (`supplier_id`),
  KEY `hutang_supplier_status_index` (`status`),
  CONSTRAINT `hutang_supplier_pembelian_id_foreign` FOREIGN KEY (`pembelian_id`) REFERENCES `pembelian` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hutang_supplier_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hutang_supplier`
--

LOCK TABLES `hutang_supplier` WRITE;
/*!40000 ALTER TABLE `hutang_supplier` DISABLE KEYS */;
/*!40000 ALTER TABLE `hutang_supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2024_01_01_000010_add_role_to_users_table',1),(5,'2024_01_01_000020_create_pengaturan_table',1),(6,'2024_01_01_000030_create_supplier_table',1),(7,'2024_01_01_000040_create_bahan_baku_table',1),(8,'2024_01_01_000060_create_pembelian_table',1),(9,'2024_01_01_000070_create_detail_pembelian_table',1),(10,'2024_01_01_000075_create_fifo_batches_table',1),(11,'2024_01_01_000080_create_produk_table',1),(12,'2024_01_01_000090_create_detail_resep_table',1),(13,'2024_01_01_000100_create_promo_table',1),(14,'2024_01_01_000110_create_detail_promo_table',1),(15,'2024_01_01_000120_create_transaksi_table',1),(16,'2024_01_01_000130_create_detail_transaksi_table',1),(17,'2024_01_01_000140_create_dompet_keuangan_table',1),(18,'2024_01_01_000150_create_pengeluaran_operasional_table',1),(19,'2024_01_01_000160_create_piutang_pelanggan_table',1),(20,'2024_01_01_000170_create_hutang_supplier_table',1),(21,'2024_01_01_000180_create_non_sales_table',1),(22,'2024_01_01_000190_create_detail_non_sales_table',1),(23,'2024_01_01_000200_create_stock_opname_table',1),(24,'2024_01_01_000210_create_detail_stock_opname_table',1),(25,'2024_01_01_000041_add_sku_to_bahan_baku_table',2),(26,'2024_01_01_000042_add_jenis_to_bahan_baku_table',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `non_sales`
--

DROP TABLE IF EXISTS `non_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `non_sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `kategori` enum('jatah_karyawan','konsumsi_owner','konsumsi_tamu','sampling','rusak','kadaluarsa','lainnya') COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_hpp` decimal(15,2) NOT NULL DEFAULT '0.00',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `non_sales_user_id_foreign` (`user_id`),
  KEY `non_sales_tanggal_index` (`tanggal`),
  CONSTRAINT `non_sales_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `non_sales`
--

LOCK TABLES `non_sales` WRITE;
/*!40000 ALTER TABLE `non_sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `non_sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pembelian`
--

DROP TABLE IF EXISTS `pembelian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pembelian` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `supplier_id` bigint unsigned DEFAULT NULL,
  `nomor_faktur` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_pembelian` date NOT NULL,
  `total_harga` decimal(15,2) NOT NULL DEFAULT '0.00',
  `jumlah_bayar` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status_pembayaran` enum('lunas','sebagian','belum_bayar') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'lunas',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pembelian_user_id_foreign` (`user_id`),
  KEY `pembelian_supplier_id_foreign` (`supplier_id`),
  CONSTRAINT `pembelian_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE SET NULL,
  CONSTRAINT `pembelian_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pembelian`
--

LOCK TABLES `pembelian` WRITE;
/*!40000 ALTER TABLE `pembelian` DISABLE KEYS */;
/*!40000 ALTER TABLE `pembelian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengaturan`
--

DROP TABLE IF EXISTS `pengaturan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengaturan` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kunci` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nilai` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pengaturan_kunci_unique` (`kunci`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengaturan`
--

LOCK TABLES `pengaturan` WRITE;
/*!40000 ALTER TABLE `pengaturan` DISABLE KEYS */;
INSERT INTO `pengaturan` VALUES (1,'persen_operasional','20','Persentase dana operasional dari HPP (%)','2026-07-03 11:44:54','2026-07-03 11:44:54'),(2,'nama_usaha','WARMINDO P3K','Nama usaha','2026-07-03 11:44:54','2026-07-03 11:44:54'),(3,'alamat_usaha','','Alamat usaha','2026-07-03 11:44:54','2026-07-03 11:44:54'),(4,'telepon_usaha','','Nomor telepon usaha','2026-07-03 11:44:54','2026-07-03 11:44:54'),(5,'footer_struk','Terima kasih sudah berkunjung!','Teks footer struk','2026-07-03 11:44:54','2026-07-03 11:44:54');
/*!40000 ALTER TABLE `pengaturan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengeluaran_operasional`
--

DROP TABLE IF EXISTS `pengeluaran_operasional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengeluaran_operasional` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `kategori` enum('listrik','internet','gas','bensin','gaji','perawatan','lainnya') COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pengeluaran_operasional_user_id_foreign` (`user_id`),
  KEY `pengeluaran_operasional_tanggal_index` (`tanggal`),
  CONSTRAINT `pengeluaran_operasional_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengeluaran_operasional`
--

LOCK TABLES `pengeluaran_operasional` WRITE;
/*!40000 ALTER TABLE `pengeluaran_operasional` DISABLE KEYS */;
/*!40000 ALTER TABLE `pengeluaran_operasional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `piutang_pelanggan`
--

DROP TABLE IF EXISTS `piutang_pelanggan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `piutang_pelanggan` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaksi_id` bigint unsigned DEFAULT NULL,
  `nama_pelanggan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomor_wa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jumlah_piutang` decimal(15,2) NOT NULL,
  `jumlah_bayar` decimal(15,2) NOT NULL DEFAULT '0.00',
  `sisa_piutang` decimal(15,2) NOT NULL,
  `status` enum('belum_lunas','lunas') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'belum_lunas',
  `tanggal_piutang` date NOT NULL,
  `tanggal_lunas` date DEFAULT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `piutang_pelanggan_transaksi_id_foreign` (`transaksi_id`),
  KEY `piutang_pelanggan_status_index` (`status`),
  CONSTRAINT `piutang_pelanggan_transaksi_id_foreign` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `piutang_pelanggan`
--

LOCK TABLES `piutang_pelanggan` WRITE;
/*!40000 ALTER TABLE `piutang_pelanggan` DISABLE KEYS */;
/*!40000 ALTER TABLE `piutang_pelanggan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produk`
--

DROP TABLE IF EXISTS `produk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produk` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Makanan',
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `harga_jual` decimal(15,2) NOT NULL,
  `has_resep` tinyint(1) NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produk`
--

LOCK TABLES `produk` WRITE;
/*!40000 ALTER TABLE `produk` DISABLE KEYS */;
/*!40000 ALTER TABLE `produk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promo`
--

DROP TABLE IF EXISTS `promo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promo` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipe` enum('harga_khusus','diskon_persen','paket_bundling') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promo`
--

LOCK TABLES `promo` WRITE;
/*!40000 ALTER TABLE `promo` DISABLE KEYS */;
/*!40000 ALTER TABLE `promo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('4sRtPueXqFyDTeKFESeTUeXUgOcNWoNj7em0Pk0i',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJ6ckkwZFBiOHRDaWtDOWwyWWhPSlVjMWN5VTdiU0xSa2lSZjIzQXlPIiwidXJsIjpbXSwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL3Azay1hcHAudGVzdFwvYmFoYW4tYmFrdSIsInJvdXRlIjoiYmFoYW4tYmFrdS5pbmRleCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoxfQ==',1783197879);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_opname`
--

DROP TABLE IF EXISTS `stock_opname`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_opname` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `tanggal` date NOT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_opname_user_id_foreign` (`user_id`),
  CONSTRAINT `stock_opname_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_opname`
--

LOCK TABLES `stock_opname` WRITE;
/*!40000 ALTER TABLE `stock_opname` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_opname` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telepon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaksi`
--

DROP TABLE IF EXISTS `transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaksi` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `nomor_transaksi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_transaksi` timestamp NOT NULL,
  `total_harga_jual` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_hpp` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_dana_modal` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_dana_operasional` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_keuntungan` decimal(15,2) NOT NULL DEFAULT '0.00',
  `metode_pembayaran` enum('cash','qris','transfer','piutang') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('selesai','piutang') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'selesai',
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaksi_nomor_transaksi_unique` (`nomor_transaksi`),
  KEY `transaksi_user_id_foreign` (`user_id`),
  KEY `transaksi_tanggal_transaksi_index` (`tanggal_transaksi`),
  KEY `transaksi_status_index` (`status`),
  CONSTRAINT `transaksi_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi`
--

LOCK TABLES `transaksi` WRITE;
/*!40000 ALTER TABLE `transaksi` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaksi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('owner','kasir') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kasir',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Owner','owner@warmindo.com','owner',NULL,'$2y$12$Ofp/tXlQ/wgY1zA53KtUWOzuAMpwKbovcQLLmFKbLNK/zgzJkLgpS',NULL,'2026-07-03 11:44:54','2026-07-03 23:25:58'),(2,'Kasir','kasir@warmindo.com','kasir',NULL,'$2y$12$/sG72dzBYvp0D9DcXz52QehVaSefwBFZsysik3p1marpZbDIG/GvS',NULL,'2026-07-03 11:44:54','2026-07-03 23:25:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-05  3:58:13

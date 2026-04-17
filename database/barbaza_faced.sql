-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2026 at 04:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `barbaza_faced`
--

-- --------------------------------------------------------

--
-- Table structure for table `assistance_records`
--

CREATE TABLE `assistance_records` (
  `id` char(36) NOT NULL,
  `faced_record_id` char(36) NOT NULL,
  `recipient_member_id` char(36) DEFAULT NULL,
  `recipient_name` varchar(200) NOT NULL,
  `date` date NOT NULL,
  `emergency_type` varchar(150) NOT NULL,
  `assistance_provided` varchar(200) NOT NULL,
  `unit` varchar(50) NOT NULL DEFAULT 'Pack',
  `quantity` decimal(10,2) NOT NULL DEFAULT 1.00,
  `cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `provider` varchar(150) DEFAULT 'LGU Barbaza',
  `status` enum('Pending Approval','Approved','Locked') NOT NULL DEFAULT 'Pending Approval',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-administration@gmail.com|127.0.0.1', 'i:1;', 1774929446),
('laravel-cache-administration@gmail.com|127.0.0.1:timer', 'i:1774929446;', 1774929446),
('laravel-cache-administratior@gmail.com|127.0.0.1', 'i:1;', 1774929453),
('laravel-cache-administratior@gmail.com|127.0.0.1:timer', 'i:1774929453;', 1774929453);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faced_records`
--

CREATE TABLE `faced_records` (
  `id` char(36) NOT NULL,
  `serial_number` varchar(50) NOT NULL,
  `status` enum('Submitted','Returned','Validated') NOT NULL DEFAULT 'Submitted',
  `region` varchar(100) NOT NULL DEFAULT 'Region VI',
  `province` varchar(100) NOT NULL DEFAULT 'Antique',
  `municipality` varchar(100) NOT NULL DEFAULT 'Barbaza',
  `district` varchar(100) DEFAULT NULL,
  `barangay` varchar(100) NOT NULL,
  `evacuation_center` varchar(150) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `name_extension` varchar(20) DEFAULT NULL,
  `civil_status` enum('Single','Married','Widowed','Separated','Co-habiting') NOT NULL DEFAULT 'Single',
  `mothers_maiden_name` varchar(150) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `age` tinyint(3) UNSIGNED DEFAULT NULL,
  `sex` enum('Male','Female') NOT NULL DEFAULT 'Male',
  `birthplace` varchar(150) DEFAULT NULL,
  `monthly_income` decimal(12,2) NOT NULL DEFAULT 0.00,
  `id_presented` varchar(100) DEFAULT 'National ID',
  `id_number` varchar(100) DEFAULT NULL,
  `contact_primary` varchar(20) DEFAULT NULL,
  `contact_alternate` varchar(20) DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `is_4ps` tinyint(1) NOT NULL DEFAULT 0,
  `is_ip` tinyint(1) NOT NULL DEFAULT 0,
  `ip_group` varchar(100) DEFAULT NULL,
  `others_category` varchar(150) DEFAULT NULL,
  `bank_provider` varchar(100) DEFAULT NULL,
  `account_name` varchar(150) DEFAULT NULL,
  `account_type` enum('Savings','Checking','E-Wallet') DEFAULT 'Savings',
  `account_number` varchar(100) DEFAULT NULL,
  `house_ownership` enum('Owner','Renter','Sharer') DEFAULT 'Owner',
  `shelter_damage` enum('None','Partially Damaged','Totally Damaged') NOT NULL DEFAULT 'None',
  `consent_checked` tinyint(1) NOT NULL DEFAULT 0,
  `signed_form_url` varchar(500) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `vai_score` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `date_registered` date NOT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faced_records`
--

INSERT INTO `faced_records` (`id`, `serial_number`, `status`, `region`, `province`, `municipality`, `district`, `barangay`, `evacuation_center`, `last_name`, `first_name`, `middle_name`, `name_extension`, `civil_status`, `mothers_maiden_name`, `religion`, `occupation`, `birthdate`, `age`, `sex`, `birthplace`, `monthly_income`, `id_presented`, `id_number`, `contact_primary`, `contact_alternate`, `permanent_address`, `is_4ps`, `is_ip`, `ip_group`, `others_category`, `bank_provider`, `account_name`, `account_type`, `account_number`, `house_ownership`, `shelter_damage`, `consent_checked`, `signed_form_url`, `remarks`, `vai_score`, `date_registered`, `created_by`, `created_at`, `updated_at`) VALUES
('0d6c17b7-3e0b-45c0-9126-51ca96a7ae2e', 'FACED-2026-0001', 'Submitted', 'Antique', 'Antique', 'Barbaza', NULL, 'Poblacion', NULL, 'Sumugat', 'John Carlo', 'Lomugdang', NULL, 'Single', 'Rosalie S. Lomugdang', 'Roman Catholic', 'Freelancer', '2003-08-08', NULL, 'Male', 'Malacanang', 3000.00, 'National ID', NULL, '09567460163', '09567460163', 'Culasi Antique, Philippines', 0, 0, NULL, NULL, 'Landbank', 'John Carlo Sumugat', 'Savings', '3376272620', 'Owner', 'Partially Damaged', 1, NULL, NULL, 40, '2026-03-12', 4, '2026-03-12 07:28:07', '2026-03-30 14:38:58');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `family_members`
--

CREATE TABLE `family_members` (
  `id` char(36) NOT NULL,
  `faced_record_id` char(36) NOT NULL,
  `name` varchar(200) NOT NULL,
  `relationship` enum('Child','Spouse','Parent','Sibling','Grandparent','In-law','Others') NOT NULL DEFAULT 'Child',
  `birthdate` date DEFAULT NULL,
  `age` tinyint(3) UNSIGNED DEFAULT NULL,
  `sex` enum('Male','Female') NOT NULL DEFAULT 'Male',
  `birthplace` varchar(150) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `educational_attainment` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `family_members`
--

INSERT INTO `family_members` (`id`, `faced_record_id`, `name`, `relationship`, `birthdate`, `age`, `sex`, `birthplace`, `occupation`, `educational_attainment`, `created_at`, `updated_at`) VALUES
('ee9147f8-8664-400d-a168-f8c6179fa59c', '0d6c17b7-3e0b-45c0-9126-51ca96a7ae2e', 'John Carlo Sumugat', 'Sibling', '2010-08-08', NULL, 'Male', NULL, NULL, NULL, '2026-03-30 06:39:17', '2026-03-30 06:39:17');

-- --------------------------------------------------------

--
-- Table structure for table `family_member_vulnerabilities`
--

CREATE TABLE `family_member_vulnerabilities` (
  `id` int(10) UNSIGNED NOT NULL,
  `family_member_id` char(36) NOT NULL,
  `vulnerability_type` enum('PWD','Senior Citizen','Pregnant/Lactating','Solo Parent','Others') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('47lLgYAIYBI7yOrzbSPKhJn4u7oegsYaN9WNpWC5', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoid05qWEwxNGl1ZEVNMlpvMHROaXpjNXFUdHdKNUlid2hlQU5pcnBxVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MCI7czo1OiJyb3V0ZSI7czo3OiJ3ZWxjb21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mzt9', 1774930807),
('7toK1IBNvNaCzwcVHgjYiDhHKvu5IXzhnaLekqCF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSnRRdkRDQ1lpd1J2Rmw0NHJJY1VPMmk4R3FpdHNmUG5sa1psVHVEViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MCI7czo1OiJyb3V0ZSI7czo3OiJ3ZWxjb21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775980848),
('8UWzv80uLfWCNsVdYZMOROC5GA09zO7rbuMdvVFb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiYzhCUzV2OEpTdllpWUpkY1lrenlOZW9meGJtMGVYTHo4WUVnOTJkbSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozNjoiaHR0cDovLzEyNy4wLjAuMTo4MDgwL3JlY29yZHMvY3JlYXRlIjt9czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fX0=', 1774930959),
('bbjYKvHaY3CPBLOG3okyPtVn6rKErCS8fcBIyrsc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUzF5aWdhR1lvMjhMY1F6ZXVyQ0tNUkhNdmFtZmhKcE1RNVFaeWhOciI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MCI7czo1OiJyb3V0ZSI7czo3OiJ3ZWxjb21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774881199),
('BkssBuy2sEYPMZOJarMxEhCwwbhMQkDlQjHsv5UI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSFI5SVBzT0w2QlFDQ2pVSTY4cGhTUlpGRzVvVWx0djM2OHRvdmd2UyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MCI7czo1OiJyb3V0ZSI7czo3OiJ3ZWxjb21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775980814),
('gOOeBF6To3Shrl3IKRDInY0QmQR1SABNHnukJWeh', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiRGVPaW9rUjlxclc2a3dlMWJlNlhhZTRRaVhWNElUZEp2b0JRSllHUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MCI7czo1OiJyb3V0ZSI7czo3OiJ3ZWxjb21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mzt9', 1776048115),
('hePHWnHg9SgU5tKnEfhY83v8khnVJhNrUj2oXlLb', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiNlMweWxVZ0RxWlBoT3hYU1pvbld4dFRLTE1US2VjNURZTGVER2dPZyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MztzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czoyOToiaHR0cDovLzEyNy4wLjAuMTo4MDgwL3JlY29yZHMiO3M6NToicm91dGUiO3M6MTM6InJlY29yZHMuaW5kZXgiO319', 1774881634),
('KptX8RTKE8nfofpc2pZCjcYHXwuW0DvwzcuD4dKV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0RnVTJ4SmNWZjJmb0VpZGd1eWMyNGZkMml2ZVJGNTJqVlVwSGoyYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MCI7czo1OiJyb3V0ZSI7czo3OiJ3ZWxjb21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774929252),
('Mmkfx9UprbjSMhq6VWCQp6vqFBfXxABfZDtarnDG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTkk5bGJsNFJaNjZkcGtIWEpKTE0yUnlZR3RlNlNUWWQ4MTlzZ0hmRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MCI7czo1OiJyb3V0ZSI7czo3OiJ3ZWxjb21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776047958),
('qoN9OxioyfWCmxO7sshbY01zEGBJjbvk9LQqdlJv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36 Edg/146.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTUlLQ1ZwbFh0Q3lYWVg5Wlo4Vzl2VUtqWXFGNHIySjlXTUtCd1hieiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODA4MCI7czo1OiJyb3V0ZSI7czo3OiJ3ZWxjb21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776047957),
('Us42M108BDWZFt14YffjxPhOhOEkV7T9kQS4o5JK', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiOWRVRHJwOExWcXI2U0lUT05RVkV0Z0JWUTlNdHdocGI2bkhnMkdWWiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MztzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czoyMToiaHR0cDovLzEyNy4wLjAuMTo4MDgwIjtzOjU6InJvdXRlIjtzOjc6IndlbGNvbWUiO319', 1776048453),
('uyfi8mHEwlaFcMFFcAq8q5tkg25MiKbyQsFFgxWW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZG5YRGVhbkNWTXQxTzdrRzdjNXhWbzYyVnpQWGFpd1huZnJHdWNVbyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774930926);

-- --------------------------------------------------------

--
-- Table structure for table `sitrep_configs`
--

CREATE TABLE `sitrep_configs` (
  `id` int(10) UNSIGNED NOT NULL,
  `sitrep_number` varchar(20) NOT NULL DEFAULT '001',
  `date` date NOT NULL,
  `period_from` date NOT NULL,
  `period_to` date NOT NULL,
  `disaster_type` varchar(100) NOT NULL,
  `disaster_name` varchar(150) NOT NULL,
  `disaster_date` date NOT NULL,
  `prepared_by` varchar(150) DEFAULT NULL,
  `position` varchar(150) DEFAULT NULL,
  `office` varchar(150) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Barangay Staff','MSWDO / Admin') NOT NULL DEFAULT 'Barangay Staff',
  `assigned_barangay` varchar(100) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `assigned_barangay`, `remember_token`, `created_at`, `updated_at`) VALUES
(3, 'Jc Sumugat', 'administrator@gmail.com', NULL, '$2y$12$/4UFAzRbQkFwPIBCwR78oO.izfb8cUl5mMBWMjSyn/.C8UnpoLv.a', 'MSWDO / Admin', NULL, 'xYPjkDePabgZEvOoPBHM7gU4uAMlNYu83jUMaWmj4KUdPJd7FK9C3UTG796P', '2026-03-11 08:49:48', '2026-03-11 08:49:48'),
(4, 'Jc Sumugat', 'staff@gmail.com', NULL, '$2y$12$XwOI3q94OC.htSO1ZkqqCexZ8EAX/2M/jU7gm25kp0XVpyLdm9VI6', 'Barangay Staff', 'Poblacion', NULL, '2026-03-11 08:58:34', '2026-03-11 08:58:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assistance_records`
--
ALTER TABLE `assistance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipient_member_id` (`recipient_member_id`),
  ADD KEY `idx_faced_record` (`faced_record_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `faced_records`
--
ALTER TABLE `faced_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_barangay` (`barangay`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_vai_score` (`vai_score`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `family_members`
--
ALTER TABLE `family_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_faced_record` (`faced_record_id`);

--
-- Indexes for table `family_member_vulnerabilities`
--
ALTER TABLE `family_member_vulnerabilities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_member_vuln` (`family_member_id`,`vulnerability_type`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_reserved_at_available_at_index` (`queue`,`reserved_at`,`available_at`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `sitrep_configs`
--
ALTER TABLE `sitrep_configs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `family_member_vulnerabilities`
--
ALTER TABLE `family_member_vulnerabilities`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sitrep_configs`
--
ALTER TABLE `sitrep_configs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assistance_records`
--
ALTER TABLE `assistance_records`
  ADD CONSTRAINT `assistance_records_ibfk_1` FOREIGN KEY (`faced_record_id`) REFERENCES `faced_records` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assistance_records_ibfk_2` FOREIGN KEY (`recipient_member_id`) REFERENCES `family_members` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `faced_records`
--
ALTER TABLE `faced_records`
  ADD CONSTRAINT `faced_records_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `family_members`
--
ALTER TABLE `family_members`
  ADD CONSTRAINT `family_members_ibfk_1` FOREIGN KEY (`faced_record_id`) REFERENCES `faced_records` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `family_member_vulnerabilities`
--
ALTER TABLE `family_member_vulnerabilities`
  ADD CONSTRAINT `family_member_vulnerabilities_ibfk_1` FOREIGN KEY (`family_member_id`) REFERENCES `family_members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sitrep_configs`
--
ALTER TABLE `sitrep_configs`
  ADD CONSTRAINT `sitrep_configs_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

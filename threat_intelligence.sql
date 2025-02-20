-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2025 at 05:37 PM
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
-- Database: `intern`
--

-- --------------------------------------------------------

--
-- Table structure for table `data_sharing_agreements`
--

CREATE TABLE `data_sharing_agreements` (
  `id` int(11) NOT NULL,
  `organization` varchar(255) NOT NULL,
  `terms` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `threats`
--

CREATE TABLE `threats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reported_by` int(11) NOT NULL,
  `threat_type` enum('spam','harassment','security_risk') NOT NULL,
  `description` text DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `category` enum('Cyber Threats','Personal Threats','Scams & Fraud','Physical Threats','Illegal Content','Misinformation','Copyright Violation','Workplace Threats') NOT NULL,
  `severity` enum('Low','Medium','High','Critical') NOT NULL,
  `status` enum('pending','reviewed','resolved') DEFAULT 'pending',
  `votes` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `stix_data` varchar(255) DEFAULT NULL,
  `pattern` text DEFAULT NULL,
  `valid_from` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `threat_comments`
--

CREATE TABLE `threat_comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `threat_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `threat_votes`
--

CREATE TABLE `threat_votes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `threat_id` int(11) NOT NULL,
  `vote` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','analyst','viewer') DEFAULT 'viewer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

ALTER TABLE `data_sharing_agreements`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `threats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stix_id` (`stix_data`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reported_by` (`reported_by`);

ALTER TABLE `threat_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `threat_id` (`threat_id`);

ALTER TABLE `threat_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`threat_id`),
  ADD KEY `threat_id` (`threat_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

ALTER TABLE `data_sharing_agreements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `threats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `threat_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `threat_votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

ALTER TABLE `threats`
  ADD CONSTRAINT `threats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `threats_ibfk_2` FOREIGN KEY (`reported_by`) REFERENCES `users` (`id`);

ALTER TABLE `threat_comments`
  ADD CONSTRAINT `threat_comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `threat_comments_ibfk_2` FOREIGN KEY (`threat_id`) REFERENCES `threats` (`id`);

ALTER TABLE `threat_votes`
  ADD CONSTRAINT `threat_votes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `threat_votes_ibfk_2` FOREIGN KEY (`threat_id`) REFERENCES `threats` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

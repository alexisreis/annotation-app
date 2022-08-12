-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 12, 2022 at 12:18 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_flask`
--
CREATE DATABASE IF NOT EXISTS `annotation_app` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `annotation_app`;

-- --------------------------------------------------------

--
-- Table structure for table `annotations`
--

CREATE TABLE `annotations` (
  `annotation_id` varchar(50) NOT NULL,
  `image_id` varchar(25) NOT NULL,
  `zone_type` tinyint(1) NOT NULL,
  `zone_coord` text NOT NULL,
  `chapitre` int(11) DEFAULT NULL,
  `page` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `document_cote` varchar(20) NOT NULL,
  `document_name` varchar(100) NOT NULL,
  `document_date` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `image_id` varchar(25) NOT NULL,
  `document_cote` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sense_smell`
--

CREATE TABLE `sense_smell` (
  `smell_id` int(11) NOT NULL,
  `annotation_id` varchar(50) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `editor_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sense_sound`
--

CREATE TABLE `sense_sound` (
  `sound_id` int(11) NOT NULL,
  `annotation_id` varchar(50) NOT NULL,
  `sound_type` varchar(30) NOT NULL,
  `sound_volume` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `editor_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sense_taste`
--

CREATE TABLE `sense_taste` (
  `taste_id` int(11) NOT NULL,
  `annotation_id` varchar(50) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `editor_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sense_touch`
--

CREATE TABLE `sense_touch` (
  `touch_id` int(11) NOT NULL,
  `annotation_id` varchar(50) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `editor_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sense_view`
--

CREATE TABLE `sense_view` (
  `view_id` int(11) NOT NULL,
  `annotation_id` varchar(50) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `editor_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `transcription`
--

CREATE TABLE `transcription` (
  `transcription_id` int(11) NOT NULL,
  `annotation_id` varchar(50) NOT NULL,
  `transcription` text NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `editor_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_type` char(1) NOT NULL,
  `user_mail` varchar(40) NOT NULL,
  `user_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `user_type`, `user_mail`, `user_password`) VALUES
(1, 'admin', 'A', 'admin', '$2a$10$w6pb68tKZnpNiR/U7kURfu7fyP1nITGqlkp4sS4roCK7rWWsDzaVi');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `annotations`
--
ALTER TABLE `annotations`
  ADD PRIMARY KEY (`annotation_id`),
  ADD KEY `annotations_image_id_index` (`image_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`document_cote`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `images_document_cote_foreign` (`document_cote`);

--
-- Indexes for table `sense_smell`
--
ALTER TABLE `sense_smell`
  ADD PRIMARY KEY (`smell_id`),
  ADD KEY `sense_smell_annotation_id_index` (`annotation_id`),
  ADD KEY `sense_smell_editor_id_foreign` (`editor_id`),
  ADD KEY `sense_smell_user_id_foreign` (`user_id`);

--
-- Indexes for table `sense_sound`
--
ALTER TABLE `sense_sound`
  ADD PRIMARY KEY (`sound_id`),
  ADD KEY `sense_sound_annotation_id_index` (`annotation_id`),
  ADD KEY `sense_sound_user_id_foreign` (`user_id`),
  ADD KEY `sense_sound_editor_id_foreign` (`editor_id`);

--
-- Indexes for table `sense_taste`
--
ALTER TABLE `sense_taste`
  ADD PRIMARY KEY (`taste_id`),
  ADD KEY `sense_taste_annotation_id_index` (`annotation_id`),
  ADD KEY `sense_taste_editor_id_foreign` (`editor_id`),
  ADD KEY `sense_taste_user_id_foreign` (`user_id`);

--
-- Indexes for table `sense_touch`
--
ALTER TABLE `sense_touch`
  ADD PRIMARY KEY (`touch_id`),
  ADD KEY `sense_touch_annotation_id_index` (`annotation_id`),
  ADD KEY `sense_touch_editor_id_foreign` (`editor_id`),
  ADD KEY `sense_touch_user_id_foreign` (`user_id`);

--
-- Indexes for table `sense_view`
--
ALTER TABLE `sense_view`
  ADD PRIMARY KEY (`view_id`),
  ADD KEY `sense_view_annotation_id_index` (`annotation_id`),
  ADD KEY `sense_view_editor_id_foreign` (`editor_id`),
  ADD KEY `sense_view_user_id_foreign` (`user_id`);

--
-- Indexes for table `transcription`
--
ALTER TABLE `transcription`
  ADD PRIMARY KEY (`transcription_id`),
  ADD KEY `transcription_annotation_id_index` (`annotation_id`),
  ADD KEY `transcription_user_id_foreign` (`user_id`),
  ADD KEY `transcription_editor_id_foreign` (`editor_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_mail` (`user_mail`) USING HASH;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sense_smell`
--
ALTER TABLE `sense_smell`
  MODIFY `smell_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sense_sound`
--
ALTER TABLE `sense_sound`
  MODIFY `sound_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sense_taste`
--
ALTER TABLE `sense_taste`
  MODIFY `taste_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sense_touch`
--
ALTER TABLE `sense_touch`
  MODIFY `touch_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sense_view`
--
ALTER TABLE `sense_view`
  MODIFY `view_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transcription`
--
ALTER TABLE `transcription`
  MODIFY `transcription_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `annotations`
--
ALTER TABLE `annotations`
  ADD CONSTRAINT `annotations_image_id_foreign` FOREIGN KEY (`image_id`) REFERENCES `images` (`image_id`) ON DELETE CASCADE;

--
-- Constraints for table `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_document_cote_foreign` FOREIGN KEY (`document_cote`) REFERENCES `documents` (`document_cote`) ON DELETE CASCADE;

--
-- Constraints for table `sense_smell`
--
ALTER TABLE `sense_smell`
  ADD CONSTRAINT `sense_smell_annotation_id_foreign` FOREIGN KEY (`annotation_id`) REFERENCES `annotations` (`annotation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sense_smell_editor_id_foreign` FOREIGN KEY (`editor_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `sense_smell_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `sense_sound`
--
ALTER TABLE `sense_sound`
  ADD CONSTRAINT `sense_sound_annotation_id_foreign` FOREIGN KEY (`annotation_id`) REFERENCES `annotations` (`annotation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sense_sound_editor_id_foreign` FOREIGN KEY (`editor_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `sense_sound_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `sense_taste`
--
ALTER TABLE `sense_taste`
  ADD CONSTRAINT `sense_taste_annotation_id_foreign` FOREIGN KEY (`annotation_id`) REFERENCES `annotations` (`annotation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sense_taste_editor_id_foreign` FOREIGN KEY (`editor_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `sense_taste_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `sense_touch`
--
ALTER TABLE `sense_touch`
  ADD CONSTRAINT `sense_touch_annotation_id_foreign` FOREIGN KEY (`annotation_id`) REFERENCES `annotations` (`annotation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sense_touch_editor_id_foreign` FOREIGN KEY (`editor_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `sense_touch_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `sense_view`
--
ALTER TABLE `sense_view`
  ADD CONSTRAINT `sense_view_annotation_id_foreign` FOREIGN KEY (`annotation_id`) REFERENCES `annotations` (`annotation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sense_view_editor_id_foreign` FOREIGN KEY (`editor_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `sense_view_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `transcription`
--
ALTER TABLE `transcription`
  ADD CONSTRAINT `transcription_annotation_id_foreign` FOREIGN KEY (`annotation_id`) REFERENCES `annotations` (`annotation_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transcription_editor_id_foreign` FOREIGN KEY (`editor_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `transcription_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 3.4.5deb1
-- http://www.phpmyadmin.net
--
-- Vært: localhost
-- Genereringstid: 14. 03 2013 kl. 13:29:38
-- Serverversion: 5.1.66
-- PHP-version: 5.3.6-13ubuntu3.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `blitz`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dato` date NOT NULL,
  `dato_text` varchar(40) NOT NULL,
  `titel` varchar(100) DEFAULT NULL,
  `beskrivelse` text,
  `arrangoer` varchar(50) DEFAULT NULL,
  `kontaktperson` varchar(50) DEFAULT NULL,
  `kontaktperson_mail` varchar(50) DEFAULT NULL,
  `lat` varchar(20) DEFAULT NULL,
  `long` varchar(20) DEFAULT NULL,
  `stedbeskrivelse` text,
  KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Data dump for tabellen `events`
--

INSERT INTO `events` (`id`, `dato`, `dato_text`, `titel`, `beskrivelse`, `arrangoer`, `kontaktperson`, `kontaktperson_mail`, `lat`, `long`, `stedbeskrivelse`) VALUES
(1, '2013-05-17', 'Fredag 17.05.2013', 'Bioblitz 2013', 'Bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ', 'Statens Nutuhistoriske Museum', 'Admiral H.A.V. Guus', 'havguus@snm.ku.dk', '55.676097', '12.568337', 'Stedbrskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse  stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse '),
(3, '2013-07-23', 'Tirsdag 23.07.2013', 'Kryptoblitz på Amager Fælled', 'bla bla bla  bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla', 'Dansk Kryptologisk Selskab', 'Kaj &quot;kryptokaj&quot; Kallesen', 'kryptokaj@dks.org', '55.676097', '12.568337', 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `event_fund`
--

CREATE TABLE IF NOT EXISTS `event_fund` (
  `LNR` int(11) NOT NULL AUTO_INCREMENT,
  `_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `taxon` varchar(80) NOT NULL,
  `dknavn` varchar(80) DEFAULT NULL,
  `finder_navn` varchar(50) NOT NULL,
  `finder_hold` varchar(50) DEFAULT NULL,
  `finder_gruppe` varchar(50) DEFAULT NULL,
  `lat` varchar(16) NOT NULL,
  `long` varchar(16) NOT NULL,
  `indtaster` varchar(40) NOT NULL,
  UNIQUE KEY `LNR` (`LNR`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `event_login`
--

CREATE TABLE IF NOT EXISTS `event_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brugernavn` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Data dump for tabellen `event_login`
--

INSERT INTO `event_login` (`id`, `brugernavn`, `password`, `email`) VALUES
(1, 'lotte', 'lotte', 'lendsleff@snm.ku.dk');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

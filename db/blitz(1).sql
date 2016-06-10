-- phpMyAdmin SQL Dump
-- version 3.4.5deb1
-- http://www.phpmyadmin.net
--
-- Vært: localhost
-- Genereringstid: 20. 03 2013 kl. 13:57:09
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
(1, '2013-05-17', 'Fredag 17.05.2013', 'Bioblitz 2013', 'Bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ', 'Statens Nutuhistoriske Museum', 'Admiral H.A.V. Guus', 'havguus@snm.ku.dk', '55.65606666697482', '12.575547695159912', 'Stedbrskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse  stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse stedbeskrivelse '),
(3, '2013-07-23', 'Tirsdag 23.07.2013', 'Kryptoblitz på Amager Fælled', 'bla bla bla  bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla', 'Dansk Kryptologisk Selskab', 'Kaj &quot;kryptokaj&quot; Kallesen', 'kryptokaj@dks.org', '55.65606666697482', '12.575547695159912', 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `event_fund`
--

CREATE TABLE IF NOT EXISTS `event_fund` (
  `LNR` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `taxon` varchar(80) NOT NULL,
  `dknavn` varchar(80) DEFAULT NULL,
  `finder_navn` varchar(50) NOT NULL,
  `finder_hold` varchar(50) DEFAULT NULL,
  `finder_gruppe` varchar(50) DEFAULT NULL,
  `lat` varchar(21) NOT NULL,
  `lng` varchar(21) NOT NULL,
  `indtaster` varchar(40) NOT NULL,
  `bestemmer` varchar(40) NOT NULL,
  `first_occurrence` int(1) NOT NULL,
  `artsgruppe` varchar(50) DEFAULT NULL,
  `artsgruppe_dk` varchar(50) DEFAULT NULL,
  UNIQUE KEY `LNR` (`LNR`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Data dump for tabellen `event_fund`
--

INSERT INTO `event_fund` (`LNR`, `event_id`, `_timestamp`, `taxon`, `dknavn`, `finder_navn`, `finder_hold`, `finder_gruppe`, `lat`, `lng`, `indtaster`, `bestemmer`, `first_occurrence`, `artsgruppe`, `artsgruppe_dk`) VALUES
(1, 1, '2013-03-19 13:22:22', 'Gabronthus thermatum', '', 'test', '', '', '55.65606666697482', '12.575547695159912', 'sdfsdfsdf', 'sdfsdf', 1, 'Coleoptera', 'Biller'),
(2, 3, '2013-03-19 13:22:59', 'Kavinia alboviridis', 'GrÃ¸n koralpig', 'qwerty dfsdfsdfsdf sfdsdffsdf', '', '', '55.65606666697482', '12.575547695159912', 'sddfsdf sdfsdfds', 'sdfsdf sddfsdfsdf', 1, 'Basidiomycota', 'Basidiesvampe'),
(3, 3, '2013-03-19 13:24:32', 'Esox lucius', 'Gedde', 'david', '', '', '55.65606666697482', '12.575547695159912', 'david', 'christian lange', 1, 'Pisces', 'Fisk'),
(4, 3, '2013-03-19 13:27:08', 'Falcaria lacertinaria', 'Tandet seglvinge', 'david', '', '', '55.65606666697482', '12.575547695159912', 'david', 'christian lange', 1, 'Lepidoptera', 'Sommerfugle'),
(5, 0, '2013-03-19 13:27:40', 'Hadena compta', 'Nellikeugle', 'david', '', '', '55.65606666697482', '12.575547695159912', 'knud jÃ¸rgen Ã¸rsted Ã¥gesen', 'christian lange', 1, 'Lepidoptera', 'Sommerfugle'),
(6, 3, '2013-03-19 13:28:36', 'Bellardia viarum', '', 'david', '', '', '55.65606666697482', '12.575547695159912', 'dovne robert', 'christian lange', 1, 'Diptera', 'Tovinger');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `event_fund_billeder`
--

CREATE TABLE IF NOT EXISTS `event_fund_billeder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `fund_id` int(11) NOT NULL,
  `filename` varchar(100) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Data dump for tabellen `event_fund_billeder`
--

INSERT INTO `event_fund_billeder` (`id`, `event_id`, `fund_id`, `filename`) VALUES
(1, 3, 3, 'http://localhost/blitz/billedupload/3/20130320130113.jpg'),
(2, 3, 3, 'http://localhost/blitz/billedupload/3/20130320130248.jpg');

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

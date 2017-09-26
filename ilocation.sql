-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Set 26, 2017 alle 16:42
-- Versione del server: 10.1.25-MariaDB
-- Versione PHP: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ilocation`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `ruolo`
--

CREATE TABLE `ruolo` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `descrizione` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `ruolo`
--

INSERT INTO `ruolo` (`id`, `nome`, `descrizione`, `timestamp`) VALUES
(1, 'admin', '', '2017-09-24 12:31:12'),
(2, 'user', '', '2017-09-25 08:32:11');

-- --------------------------------------------------------

--
-- Struttura della tabella `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `id_ruolo` int(11) NOT NULL DEFAULT '2',
  `email` varchar(50) NOT NULL,
  `nome` varchar(25) NOT NULL,
  `cognome` varchar(25) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `status_connected` int(1) NOT NULL DEFAULT '0',
  `status` int(1) NOT NULL DEFAULT '1',
  `room` varchar(50) NOT NULL DEFAULT 'gruppo',
  `colorMarker` varchar(20) NOT NULL DEFAULT '#FF0000',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `user`
--

INSERT INTO `user` (`id`, `id_ruolo`, `email`, `nome`, `cognome`, `password`, `token`, `status_connected`, `status`, `room`, `colorMarker`, `timestamp`) VALUES
(1, 1, 'admin@email.it', 'Fabio', 'Ziviello', 'psw', 'gZ7lzhyTouPEVREaepvAXOjsAScP0yi_WqDKsH2qi291-KcugG9VUoZjhvDI7itUeNLRf3eAJCvt8sDk4W3t9Q', 0, 1, 'gruppo', '#ff0000', '2017-08-13 21:40:53'),
(2, 2, 'user@email.it', 'utente', 'test', 'psw', 'BKIXqS58H3XqLuofPA32DfMaUeDDl8lGtjt2LWiRtZeR3HtyoyqlAMBRA3IIex7Ky8OSZBTbOkv-8kZGyyS4Wg', 0, 1, 'gruppo', '#ff0006', '2017-08-13 15:30:16');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `ruolo`
--
ALTER TABLE `ruolo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Indici per le tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_ruolo` (`id_ruolo`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `ruolo`
--
ALTER TABLE `ruolo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT per la tabella `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

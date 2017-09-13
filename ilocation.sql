-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Set 08, 2017 alle 09:44
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
-- Struttura della tabella `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `nome` varchar(25) NOT NULL,
  `cognome` varchar(25) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `room` varchar(50) NOT NULL DEFAULT 'gruppo',
  `colorMarker` varchar(20) NOT NULL DEFAULT '#FF0000',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `user`
--

INSERT INTO `user` (`id`, `email`, `nome`, `cognome`, `password`, `token`, `status`, `room`, `colorMarker`, `timestamp`) VALUES
(1, 'admin@email.it', 'fabio', 'ziviello', 'psw', 'kr9CM3nRRb0Fjkrur7rEgI_J7Z6heWeLwI7fZLjSNkulzrtenoVb65i5x-1i9_203QOtluW2DVYUUztwNxJjXw', 0, 'gruppo', '#FF0000', '2017-08-14 13:40:53'),
(8, 'test@email.it', 'test', 'test cognome', 'psw', '2zHxcRmCtvB37fQHj-NLNsoYhEAyvubxma4IeB2o85joDUXxnbY4pDy4LnYKonyOSO2nGl3pkL6iUOFkesldrQ', 0, 'gruppo', '#0000', '2017-08-15 11:30:16');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

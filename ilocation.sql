-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ott 10, 2017 alle 14:46
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
(1, 'admin', 'accesso completo', '2017-09-24 12:31:12'),
(2, 'user', 'utente base', '2017-09-25 08:32:11');

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
  `photo` varchar(255) NOT NULL DEFAULT 'defaultProfileImg.jpg',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `user`
--

INSERT INTO `user` (`id`, `id_ruolo`, `email`, `nome`, `cognome`, `password`, `token`, `status_connected`, `status`, `room`, `colorMarker`, `photo`, `timestamp`) VALUES
(1, 1, 'admin@email.it', 'Fabio', 'Ziviello', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', '6LiaLAvUgJ8bghgboZgSBQnaLBaIFtO6WH6VLuyn_Kgi3AMJoPOoL8PvBn9A3RSvt7Zb6I_q_W7TaMvG1XN1SQ', 1, 1, 'gruppo', '#5fc13e', 'defaultProfileImg.jpg', '2017-08-13 21:40:53'),
(2, 2, 'raffallo@email.it', 'Raffaello', 'Ziviello', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'V5OxfemA8T0sffEQ1FALrtJam7qJjWGLlMClas6Y59_kQeiBOWCc4OrI6mZBSzqeV_jtScDVdRXDPyhyrrvvdA', 0, 1, 'gruppo', '#0080ff', 'defaultProfileImg.jpg', '2017-08-13 15:30:16').
(3, 3, 'antonio@email.it', 'Antonio', 'Ziviello', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'V5OxfemA8T0sffEQ1FALrtJam7qJjWGLlMClas6Y59_kQeiBOWCc4OrI6mZBSzqeV_jtScDVdRXDPyhyrrvvdA', 0, 1, 'gruppo', '#0080ff', 'defaultProfileImg.jpg', '2017-08-13 15:30:16');


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

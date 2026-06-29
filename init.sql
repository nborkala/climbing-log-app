-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Cze 29, 2026 at 06:28 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app_dziennik_wsp`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `drogi`
--

CREATE TABLE `drogi` (
  `id` int(11) NOT NULL,
  `nazwa` varchar(100) NOT NULL,
  `stopien` varchar(20) NOT NULL,
  `dlugosc` int(11) DEFAULT NULL,
  `sektor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `drogi`
--

INSERT INTO `drogi` (`id`, `nazwa`, `stopien`, `dlugosc`, `sektor_id`) VALUES
(1, 'Dziad i Baba', 'VI.1', 20, 1),
(2, 'Krew, pot i łzy', 'VI.1', 18, 1),
(3, 'Czuj, czuj, czuwaj', 'VI', 18, 1),
(4, 'Filar Biblioteki', 'VI+', 16, 2),
(5, 'Prawostronne Zapalenie Płuc', 'VI.1+', 18, 2),
(6, 'Kac Morderca', 'VI.2', 15, 2),
(7, 'Droga Pokoju', 'VI.2', 20, 3),
(8, 'Zacięcie Okiennika', 'IV+', 22, 3),
(9, 'Lewy Lechfor', 'VI.1+', 18, 4),
(10, 'Prawy Lechfor', 'VI.1', 18, 4),
(11, 'Rysa Gorayskiego', 'V+', 25, 5),
(12, 'Prawy Biedermann', 'VI+', 25, 5),
(13, 'Superkancik', 'VI', 25, 5),
(14, 'Zanikanie Bicepsa', 'VI.1', 22, 6),
(15, 'Lot na Wschód', 'VI.1', 20, 6),
(16, 'Będkowski Playboy', 'VI.1+', 20, 7),
(17, 'Kakofonia', 'VI.2+', 22, 7),
(18, 'Trzy kroki do nieba', 'VI.2', 20, 7),
(19, 'Nienasycenie', 'VI.3', 22, 7),
(20, 'Lot na smoku', 'VI.3', 30, 8),
(21, 'Lewy Filar', 'VI.1+', 30, 8),
(22, 'Superdirettissima', 'VI.2', 30, 8),
(23, 'Filar Pokutników', 'VI', 25, 9),
(24, 'Rysa Kurtyki', 'VI.1+', 25, 9),
(25, 'Zacięcie Szarej Płyty', 'V+', 25, 9),
(26, 'Rysa Kukuczki', 'VI+', 15, 10),
(27, 'Komin Opadających Liści', 'V', 15, 10),
(28, 'Przez Różę', 'VI.1', 15, 10),
(29, 'Szafa Gra', 'VI.1', 18, 11),
(30, 'Wejście do Szafy', 'V+', 18, 11),
(31, 'Przebudzenie Mocy', 'VI.1', 15, 12),
(32, 'Złoty Kant', 'VI+', 14, 12),
(33, 'Rysa Rożnowska', 'VI', 15, 12),
(34, 'Rysa Myszkowska', 'VI.1', 18, 1),
(35, 'Znikający Punkt', 'VI.2', 15, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `lokalizacje`
--

CREATE TABLE `lokalizacje` (
  `id` int(11) NOT NULL,
  `nazwa` varchar(100) NOT NULL,
  `typ_skaly` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `lokalizacje`
--

INSERT INTO `lokalizacje` (`id`, `nazwa`, `typ_skaly`) VALUES
(1, 'Podlesice (Jura Północna)', 'Wapień'),
(2, 'Rzędkowice (Jura Północna)', 'Wapień'),
(3, 'Sokoliki (Rudawy Janowickie)', 'Granit'),
(4, 'Dolina Będkowska (Jura Południowa)', 'Wapień'),
(5, 'Dolina Bolechowicka (Jura Południowa)', 'Wapień'),
(6, 'Mirów (Jura Północna)', 'Wapień'),
(7, 'Rożnów (Pogórze Rożnowskie)', 'Piaskowiec');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `przejscia`
--

CREATE TABLE `przejscia` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `droga_id` int(11) NOT NULL,
  `styl` varchar(30) NOT NULL,
  `liczba_prob` int(11) DEFAULT 1,
  `data_przejscia` date NOT NULL,
  `ocena` int(11) DEFAULT NULL CHECK (`ocena` between 1 and 5),
  `komentarz` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `przejscia`
--

INSERT INTO `przejscia` (`id`, `user_id`, `droga_id`, `styl`, `liczba_prob`, `data_przejscia`, `ocena`, `komentarz`) VALUES
(1, 1, 1, 'OS', 1, '2023-05-12', 4, 'Piękna, klasyczna linia. Chwyty dość wyślizgane.'),
(2, 1, 4, 'RP', 2, '2023-05-13', 5, 'W pierwszej próbie pomyliłem sekwencję w kruksie. Drugie wstawienie już na spokojnie.'),
(3, 1, 9, 'Flash', 1, '2023-06-03', 4, 'Znajomy sprzedał mi patenty, poszło gładko.'),
(4, 1, 25, 'OS', 1, '2023-07-20', 3, 'Dość rzęchowate, ale ma bywało gorzej.'),
(6, 2, 2, 'RP', 3, '2024-05-01', 4, 'Trochę ślisko w kruksie, ale w 3 próbie noga siadła idealnie.'),
(7, 2, 8, 'OS', 1, '2024-05-02', 3, 'Obowiązkowy klasyk na rozgrzewkę.'),
(8, 2, 14, 'Flash', 1, '2024-06-15', 5, 'Dzięki chłopakom spod skały za idealne patenty! Granit wymiata.'),
(9, 3, 6, 'RP', 5, '2024-04-20', 4, 'Zabójczy bulder na starcie, potem już puszcza. Palce bolały jeszcze dwa dni.'),
(10, 3, 12, 'OS', 1, '2024-07-10', 5, 'Piękne, logiczne rysy. Każdy powinien to zrobić.'),
(11, 3, 26, 'OS', 1, '2024-08-05', 5, 'Historyczna linia, puszcza od strzału, choć ciągowa.'),
(12, 3, 22, 'RP', 2, '2024-08-12', 4, 'Prawie padło w pierwszej wstawce, głupi błąd ustawienia nóg pod łańcuchem.'),
(13, 1, 2, 'Flash', 1, '2026-06-09', 4, 'Soft, fajne ruchy');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `sektory`
--

CREATE TABLE `sektory` (
  `id` int(11) NOT NULL,
  `nazwa` varchar(100) NOT NULL,
  `lokalizacja_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `sektory`
--

INSERT INTO `sektory` (`id`, `nazwa`, `lokalizacja_id`) VALUES
(1, 'Góra Zborów', 1),
(2, 'Biblioteka', 1),
(3, 'Okiennik Rzędkowicki', 2),
(4, 'Turnia Lechfora', 2),
(5, 'Krzywa Turnia', 3),
(6, 'Sukiennice', 3),
(7, 'Dupa Słonia', 4),
(8, 'Sokolica', 4),
(9, 'Brama Bolechowicka (Filar Pokutników)', 5),
(10, 'Turnia Kukuczki', 6),
(11, 'Szafa', 6),
(12, 'Skały nad Dunajcem', 7);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `uzytkownicy`
--

CREATE TABLE `uzytkownicy` (
  `id` int(11) NOT NULL,
  `login` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `haslo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `uzytkownicy`
--

INSERT INTO `uzytkownicy` (`id`, `login`, `email`, `haslo`) VALUES
(1, 'Wspinacz_Testowy', 'test@wspinanie.pl', 'haslo123'),
(2, 'Janusz_Skala', 'janusz@wspinanie.pl', 'haslo123'),
(3, 'Mocna_Kasia', 'kasia@wspinanie.pl', 'haslo321');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `drogi`
--
ALTER TABLE `drogi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sektor_id` (`sektor_id`);

--
-- Indeksy dla tabeli `lokalizacje`
--
ALTER TABLE `lokalizacje`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `przejscia`
--
ALTER TABLE `przejscia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `droga_id` (`droga_id`);

--
-- Indeksy dla tabeli `sektory`
--
ALTER TABLE `sektory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lokalizacja_id` (`lokalizacja_id`);

--
-- Indeksy dla tabeli `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `drogi`
--
ALTER TABLE `drogi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `lokalizacje`
--
ALTER TABLE `lokalizacje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `przejscia`
--
ALTER TABLE `przejscia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `sektory`
--
ALTER TABLE `sektory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `drogi`
--
ALTER TABLE `drogi`
  ADD CONSTRAINT `drogi_ibfk_1` FOREIGN KEY (`sektor_id`) REFERENCES `sektory` (`id`);

--
-- Constraints for table `przejscia`
--
ALTER TABLE `przejscia`
  ADD CONSTRAINT `przejscia_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `uzytkownicy` (`id`),
  ADD CONSTRAINT `przejscia_ibfk_2` FOREIGN KEY (`droga_id`) REFERENCES `drogi` (`id`);

--
-- Constraints for table `sektory`
--
ALTER TABLE `sektory`
  ADD CONSTRAINT `sektory_ibfk_1` FOREIGN KEY (`lokalizacja_id`) REFERENCES `lokalizacje` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

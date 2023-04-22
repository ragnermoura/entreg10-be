-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 22-Abr-2023 às 20:32
-- Versão do servidor: 10.4.21-MariaDB
-- versão do PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `db_entreg10`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb001_user`
--

CREATE TABLE `tb001_user` (
  `id_users` int(11) NOT NULL,
  `nome` varchar(220) NOT NULL,
  `sobrenome` varchar(220) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `senha` varchar(150) DEFAULT NULL,
  `id_nivel` int(11) NOT NULL,
  `id_status` int(11) NOT NULL,
  `foto_user` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb002_nivel`
--

CREATE TABLE `tb002_nivel` (
  `id_nivel` int(11) NOT NULL,
  `label` varchar(220) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `tb002_nivel`
--

INSERT INTO `tb002_nivel` (`id_nivel`, `label`) VALUES
(1, 'Adminstrador'),
(2, 'Cliente'),
(3, 'Entregador');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb003_status`
--

CREATE TABLE `tb003_status` (
  `id_status` int(11) NOT NULL,
  `label` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `tb003_status`
--

INSERT INTO `tb003_status` (`id_status`, `label`) VALUES
(1, 'Ativo'),
(2, 'Inativo'),
(3, 'Aguardando'),
(4, 'A caminho'),
(5, 'Entregue');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb004_dados_empresa`
--

CREATE TABLE `tb004_dados_empresa` (
  `id_empresa` int(11) NOT NULL,
  `razao_social` varchar(300) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `cep` varchar(120) DEFAULT NULL,
  `telefone1` varchar(45) DEFAULT NULL,
  `telefone2` varchar(45) DEFAULT NULL,
  `cnpj` varchar(100) DEFAULT NULL,
  `id_segmento` int(11) NOT NULL,
  `site` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb005_segmento`
--

CREATE TABLE `tb005_segmento` (
  `id_segmento` int(11) NOT NULL,
  `label` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `tb005_segmento`
--

INSERT INTO `tb005_segmento` (`id_segmento`, `label`) VALUES
(1, 'Alimentação'),
(2, 'FastFood'),
(3, 'Moda'),
(4, 'Beleza & Estética'),
(5, 'Saúde'),
(6, 'Educação'),
(7, 'Tecnologia'),
(8, 'Automotivo'),
(9, 'Serviços Financeiros'),
(10, 'Viagem e Turísmo'),
(11, 'Varejo'),
(12, 'logística'),
(13, 'Esporte & Fitness'),
(14, 'Petshop'),
(15, 'Serviços jurídicos'),
(16, 'Serviços de limpeza e conservação'),
(17, 'Casa e decoração'),
(18, 'Consultoria'),
(19, 'Agricultira e agronegócio'),
(20, 'Entretenimento e Cultura');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb006_dados_entregador`
--

CREATE TABLE `tb006_dados_entregador` (
  `id_entregador` int(11) NOT NULL,
  `endereco` varchar(45) DEFAULT NULL,
  `cep` varchar(45) DEFAULT NULL,
  `telefone1` varchar(45) DEFAULT NULL,
  `telefone2` varchar(45) DEFAULT NULL,
  `cnh` varchar(45) DEFAULT NULL,
  `cpf` varchar(45) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `marca_moto` varchar(100) DEFAULT NULL,
  `modelo_moto` varchar(100) DEFAULT NULL,
  `ano_moto` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tb007_pedido`
--

CREATE TABLE `tb007_pedido` (
  `idpedidos` int(11) NOT NULL,
  `nome_cliente` varchar(200) DEFAULT NULL,
  `endereco_entrega` varchar(220) DEFAULT NULL,
  `cep` varchar(220) DEFAULT NULL,
  `telefone1` varchar(220) DEFAULT NULL,
  `valor_pedido` varchar(220) DEFAULT NULL,
  `metodo_pagamento` varchar(220) DEFAULT NULL,
  `id_solicitante` int(11) DEFAULT NULL,
  `id_status` int(11) DEFAULT NULL,
  `id_entregador` int(11) DEFAULT NULL,
  `data_pedido` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `tb001_user`
--
ALTER TABLE `tb001_user`
  ADD PRIMARY KEY (`id_users`),
  ADD KEY `fk_tb001_login_tb003_status1_idx` (`id_status`),
  ADD KEY `FK_NIVEL` (`id_nivel`);

--
-- Índices para tabela `tb002_nivel`
--
ALTER TABLE `tb002_nivel`
  ADD PRIMARY KEY (`id_nivel`);

--
-- Índices para tabela `tb003_status`
--
ALTER TABLE `tb003_status`
  ADD PRIMARY KEY (`id_status`);

--
-- Índices para tabela `tb004_dados_empresa`
--
ALTER TABLE `tb004_dados_empresa`
  ADD PRIMARY KEY (`id_empresa`),
  ADD KEY `fk_tb004_dados_empresa_tb001_login1_idx` (`id_user`),
  ADD KEY `FK_SEGMENTO` (`id_segmento`);

--
-- Índices para tabela `tb005_segmento`
--
ALTER TABLE `tb005_segmento`
  ADD PRIMARY KEY (`id_segmento`);

--
-- Índices para tabela `tb006_dados_entregador`
--
ALTER TABLE `tb006_dados_entregador`
  ADD PRIMARY KEY (`id_entregador`),
  ADD KEY `fk_tb006_dados_entregador_tb001_user1_idx` (`id_user`);

--
-- Índices para tabela `tb007_pedido`
--
ALTER TABLE `tb007_pedido`
  ADD PRIMARY KEY (`idpedidos`),
  ADD KEY `USER` (`id_solicitante`),
  ADD KEY `ENTREGADOR` (`id_entregador`),
  ADD KEY `STATUS` (`id_status`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tb001_user`
--
ALTER TABLE `tb001_user`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb002_nivel`
--
ALTER TABLE `tb002_nivel`
  MODIFY `id_nivel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `tb003_status`
--
ALTER TABLE `tb003_status`
  MODIFY `id_status` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `tb004_dados_empresa`
--
ALTER TABLE `tb004_dados_empresa`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb005_segmento`
--
ALTER TABLE `tb005_segmento`
  MODIFY `id_segmento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `tb006_dados_entregador`
--
ALTER TABLE `tb006_dados_entregador`
  MODIFY `id_entregador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb007_pedido`
--
ALTER TABLE `tb007_pedido`
  MODIFY `idpedidos` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `tb001_user`
--
ALTER TABLE `tb001_user`
  ADD CONSTRAINT `FK_NIVEL` FOREIGN KEY (`id_nivel`) REFERENCES `tb002_nivel` (`id_nivel`),
  ADD CONSTRAINT `fk_tb001_login_tb003_status1` FOREIGN KEY (`id_status`) REFERENCES `tb003_status` (`id_status`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `tb004_dados_empresa`
--
ALTER TABLE `tb004_dados_empresa`
  ADD CONSTRAINT `FK_SEGMENTO` FOREIGN KEY (`id_segmento`) REFERENCES `tb005_segmento` (`id_segmento`),
  ADD CONSTRAINT `fk_tb004_dados_empresa_tb001_login1` FOREIGN KEY (`id_user`) REFERENCES `tb001_user` (`id_users`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `tb006_dados_entregador`
--
ALTER TABLE `tb006_dados_entregador`
  ADD CONSTRAINT `fk_tb006_dados_entregador_tb001_user1` FOREIGN KEY (`id_user`) REFERENCES `tb001_user` (`id_users`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `tb007_pedido`
--
ALTER TABLE `tb007_pedido`
  ADD CONSTRAINT `ENTREGADOR` FOREIGN KEY (`id_entregador`) REFERENCES `tb001_user` (`id_users`),
  ADD CONSTRAINT `STATUS` FOREIGN KEY (`id_status`) REFERENCES `tb003_status` (`id_status`),
  ADD CONSTRAINT `USER` FOREIGN KEY (`id_solicitante`) REFERENCES `tb001_user` (`id_users`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

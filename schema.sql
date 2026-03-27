-- Impulso Web Database Schema
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS impulso_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE impulso_web;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clientes table
CREATE TABLE clientes (
  id VARCHAR(50) PRIMARY KEY,
  user_id INT,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('lead', 'cliente', 'aguardando', 'fechado', 'desistente') DEFAULT 'lead',
  prioridade ENUM('baixa', 'normal', 'alta') DEFAULT 'normal',
  nome VARCHAR(255) NOT NULL,
  idade INT,
  telefone VARCHAR(20),
  email VARCHAR(255),
  empresa VARCHAR(255),
  servico VARCHAR(255),
  valor DECIMAL(10,2) DEFAULT 0,
  obs TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_prioridade (prioridade)
);

-- Projetos table
CREATE TABLE projetos (
  id VARCHAR(50) PRIMARY KEY,
  user_id INT,
  cliente_id VARCHAR(50),
  data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status_projeto ENUM('planejamento', 'design', 'desenvolvimento', 'testes', 'finalizando', 'entregue') DEFAULT 'planejamento',
  progresso INT DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  cliente_nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(255),
  valor DECIMAL(10,2) DEFAULT 0,
  prazo INT,
  obs TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  INDEX idx_status_projeto (status_projeto)
);

-- Reunioes table
CREATE TABLE reunioes (
  id VARCHAR(50) PRIMARY KEY,
  user_id INT,
  cliente_id VARCHAR(50),
  cliente_nome VARCHAR(255) NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  tipo ENUM('online', 'presencial') DEFAULT 'online',
  link TEXT,
  obs TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  INDEX idx_data (data),
  INDEX idx_cliente (cliente_id)
);

-- Notifications table
CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id INT NOT NULL,
  msg TEXT NOT NULL,
  type ENUM('info', 'success', 'error') DEFAULT 'info',
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, read),
  INDEX idx_ts (ts DESC)
);

-- Insert demo admin user (password: admin123 hashed)
INSERT INTO users (email, password, nome, role) VALUES 
('admin@iw.com', '$2a$12$examplehashwillbereplaced', 'Admin', 'admin');

-- Notes:
-- 1. Update .env DB_PASSWORD
-- 2. Run: npm i -g mysql2 (if needed)
-- 3. Backend will hash passwords on register/login.

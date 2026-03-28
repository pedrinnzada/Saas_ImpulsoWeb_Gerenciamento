-- Impulso Web Postgres Schema for Render
-- Connect to Render Postgres DB and run this

-- Create DB if needed (Render pre-creates)
-- \c impulso_web

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";

-- Drop tables if exist (for migration)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reunioes CASCADE;
DROP TABLE IF EXISTS projetos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clientes
CREATE TABLE clientes (
  id VARCHAR(50) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'lead' CHECK (status IN ('lead', 'cliente', 'aguardando', 'fechado', 'desistente')),
  prioridade VARCHAR(20) DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta')),
  nome VARCHAR(255) NOT NULL,
  idade INTEGER,
  telefone VARCHAR(20),
  email VARCHAR(255),
  empresa VARCHAR(255),
  servico VARCHAR(255),
  valor NUMERIC(10,2) DEFAULT 0,
  obs TEXT
);
CREATE INDEX idx_status ON clientes(status);
CREATE INDEX idx_prioridade ON clientes(prioridade);

-- Projetos
CREATE TABLE projetos (
  id VARCHAR(50) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  cliente_id VARCHAR(50) REFERENCES clientes(id) ON DELETE SET NULL,
  data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status_projeto VARCHAR(20) DEFAULT 'planejamento' CHECK (status_projeto IN ('planejamento', 'design', 'desenvolvimento', 'testes', 'finalizando', 'entregue')),
  progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  cliente_nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(255),
  valor NUMERIC(10,2) DEFAULT 0,
  prazo INTEGER,
  obs TEXT
);
CREATE INDEX idx_status_projeto ON projetos(status_projeto);

-- Reunioes
CREATE TABLE reunioes (
  id VARCHAR(50) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  cliente_id VARCHAR(50) REFERENCES clientes(id) ON DELETE SET NULL,
  cliente_nome VARCHAR(255) NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  tipo VARCHAR(20) DEFAULT 'online' CHECK (tipo IN ('online', 'presencial')),
  link TEXT,
  obs TEXT
);
CREATE INDEX idx_data ON reunioes(data);
CREATE INDEX idx_cliente ON reunioes(cliente_id);

-- Notifications
CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'uuid_generate_v4()',
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  msg TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'error')),
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_user_read ON notifications(user_id, read);
CREATE INDEX idx_ts ON notifications(ts DESC);

-- Seed demo admin (password: admin123)
INSERT INTO users (email, password, nome, role) VALUES 
('admin@iw.com', '$2a$12$Wq.z6.z6z6z6z6z6z6z6z6euWq.z6.z6z6z6z6z6z6z6z6z6z6z6', 'Admin', 'admin') 
ON CONFLICT (email) DO NOTHING;

-- Note: Generate real bcrypt hash: node -e "console.log(require('bcryptjs').hashSync('admin123', 12))"
-- Replace above password hash.

-- Test: SELECT * FROM users;


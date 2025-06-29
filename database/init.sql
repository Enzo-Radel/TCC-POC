-- Script de inicialização do banco de dados POC
-- Este arquivo será executado automaticamente quando o container MySQL for criado

-- Tabela de categorias de investimentos
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de investimentos
CREATE TABLE IF NOT EXISTS investimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    data_vencimento DATE NOT NULL,
    tipo_taxa_juros ENUM('porcentagem', 'indice', 'mista') NOT NULL DEFAULT 'porcentagem',
    rentabilidade DECIMAL(8,4) DEFAULT 0.0000,
    indices ENUM('CDI', 'IPCA', 'SELIC', 'IGPM', 'TJLP') NULL,
    porcentagem_do_indice DECIMAL(8,4) NULL,
    categoria_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    INDEX idx_categoria (categoria_id),
    INDEX idx_data_vencimento (data_vencimento)
);

-- Tabela de aportes
CREATE TABLE IF NOT EXISTS aportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investimento_id INT NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data_aporte DATE NOT NULL DEFAULT (CURDATE()),
    observacoes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (investimento_id) REFERENCES investimentos(id) ON DELETE CASCADE,
    INDEX idx_investimento (investimento_id),
    INDEX idx_data_aporte (data_aporte)
);

-- Tabela de retiradas
CREATE TABLE IF NOT EXISTS retiradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investimento_id INT NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data_retirada DATE NOT NULL DEFAULT (CURDATE()),
    observacoes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (investimento_id) REFERENCES investimentos(id) ON DELETE CASCADE,
    INDEX idx_investimento (investimento_id),
    INDEX idx_data_retirada (data_retirada)
);

-- Inserindo categorias de exemplo
INSERT INTO categorias (nome) VALUES 
    ('Tesouro Direto'),
    ('CDB'),
    ('LCI/LCA'),
    ('Debêntures'),
    ('Fundos de Renda Fixa');

-- Inserindo investimentos de exemplo
INSERT INTO investimentos (titulo, data_vencimento, tipo_taxa_juros, rentabilidade, indices, porcentagem_do_indice, categoria_id) VALUES 
    ('Tesouro Selic 2027', '2027-03-01', 'indice', 0.0000, 'SELIC', 100.0000, 1),
    ('CDB Banco Inter', '2025-12-15', 'indice', 0.0000, 'CDI', 105.0000, 2),
    ('Tesouro IPCA+ 2030', '2030-08-15', 'mista', 5.2500, 'IPCA', 100.0000, 1),
    ('LCI Santander', '2026-06-30', 'porcentagem', 9.5000, NULL, NULL, 3);

-- Inserindo aportes de exemplo
INSERT INTO aportes (investimento_id, valor, data_aporte, observacoes) VALUES 
    (1, 1000.00, '2024-01-15', 'Primeiro aporte no Tesouro Selic'),
    (1, 500.00, '2024-02-15', 'Segundo aporte'),
    (2, 2000.00, '2024-01-20', 'Aporte inicial CDB'),
    (3, 1500.00, '2024-01-25', 'Investimento IPCA+'),
    (4, 3000.00, '2024-02-01', 'Aporte LCI');

-- Inserindo retiradas de exemplo
INSERT INTO retiradas (investimento_id, valor, data_retirada, observacoes) VALUES 
    (1, 200.00, '2024-03-10', 'Retirada parcial para emergência'),
    (2, 500.00, '2024-02-28', 'Rebalanceamento de carteira');

-- View para investimentos com informações completas
CREATE VIEW investimentos_completos AS
SELECT 
    i.id,
    i.titulo,
    i.data_vencimento,
    i.tipo_taxa_juros,
    i.rentabilidade,
    i.indices,
    i.porcentagem_do_indice,
    c.nome as categoria_nome,
    c.id as categoria_id,
    COALESCE(SUM(a.valor), 0) as total_aportado,
    COALESCE(SUM(r.valor), 0) as total_retirado,
    (COALESCE(SUM(a.valor), 0) - COALESCE(SUM(r.valor), 0)) as saldo_atual,
    COUNT(DISTINCT a.id) as total_aportes,
    COUNT(DISTINCT r.id) as total_retiradas,
    i.created_at,
    i.updated_at
FROM investimentos i
LEFT JOIN categorias c ON i.categoria_id = c.id
LEFT JOIN aportes a ON i.id = a.investimento_id
LEFT JOIN retiradas r ON i.id = r.investimento_id
GROUP BY i.id, i.titulo, i.data_vencimento, i.tipo_taxa_juros, i.rentabilidade, 
         i.indices, i.porcentagem_do_indice, c.nome, c.id, i.created_at, i.updated_at
ORDER BY i.created_at DESC; 
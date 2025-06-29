-- Script de inicialização do banco de dados POC
-- Este arquivo será executado automaticamente quando o container MySQL for criado

-- Criando tabela de usuários como exemplo
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criando tabela de posts como exemplo
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Inserindo dados de exemplo
INSERT INTO users (name, email) VALUES 
    ('João Silva', 'joao@exemplo.com'),
    ('Maria Santos', 'maria@exemplo.com'),
    ('Pedro Oliveira', 'pedro@exemplo.com');

INSERT INTO posts (user_id, title, content) VALUES 
    (1, 'Primeiro Post', 'Este é o conteúdo do primeiro post.'),
    (1, 'Segundo Post', 'Conteúdo do segundo post do João.'),
    (2, 'Post da Maria', 'Post escrito pela Maria Santos.'),
    (3, 'Olá Mundo', 'Primeiro post do Pedro no sistema.');

-- Criando view para posts com informações dos usuários
CREATE VIEW posts_with_users AS
SELECT 
    p.id,
    p.title,
    p.content,
    p.created_at as post_created_at,
    u.name as author_name,
    u.email as author_email
FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC; 
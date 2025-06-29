# 🚀 POC - Ambiente de Desenvolvimento React + Node.js + MySQL

Este projeto é uma prova de conceito (POC) que demonstra um ambiente de desenvolvimento completo usando React, Node.js, MySQL e Tailwind CSS.

## 📋 Tecnologias Utilizadas

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Banco de Dados**: MySQL 8.0
- **Containerização**: Docker + Docker Compose
- **Gerenciamento de Banco**: phpMyAdmin

## 🏗️ Estrutura do Projeto

```
poc/
├── poc-frontend/          # Aplicação React
├── poc-backend/           # API Node.js
├── database/              # Scripts SQL
│   └── init.sql          # Inicialização do banco
├── docker-compose.yml     # Configuração Docker
└── README.md             # Este arquivo
```

## 🛠️ Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Docker** e **Docker Compose**

## 🚀 Como Executar

### 1. Clonar e Instalar Dependências

```bash
# Navegar para o diretório do projeto
cd poc

# Instalar dependências do backend
cd poc-backend
npm install

# Instalar dependências do frontend
cd ../poc-frontend
npm install
```

### 2. Configurar o Banco de Dados

```bash
# Voltar ao diretório raiz
cd ..

# Iniciar MySQL e phpMyAdmin com Docker
docker-compose up -d

# Verificar se os containers estão rodando
docker-compose ps
```

**Credenciais do Banco:**
- **Host**: localhost
- **Porta**: 3306
- **Usuário**: root
- **Senha**: root123
- **Banco**: poc_database

**Acesso ao phpMyAdmin:**
- URL: http://localhost:8080
- Usuário: root
- Senha: root123

### 3. Configurar Variáveis de Ambiente

```bash
# No diretório poc-backend, o arquivo .env já está configurado
# Você pode editá-lo se necessário
```

### 4. Executar a Aplicação

**Terminal 1 - Backend:**
```bash
cd poc-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd poc-frontend
npm start
```

### 5. Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **phpMyAdmin**: http://localhost:8080

## 📚 Endpoints da API

### Rotas Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Mensagem de boas-vindas |
| GET | `/api/health` | Status da API |
| GET | `/api/test-db` | Teste de conexão com banco |

### Exemplos de Uso

```bash
# Verificar status da API
curl http://localhost:3001/api/health

# Testar conexão com banco
curl http://localhost:3001/api/test-db
```

## 🎨 Recursos do Frontend

- **Design Responsivo** com Tailwind CSS
- **Componentes Modernos** com gradientes e shadows
- **Monitoramento de Status** do backend em tempo real
- **Interface Intuitiva** com cards informativos

## 🗄️ Estrutura do Banco de Dados

O banco já vem com tabelas e dados de exemplo:

### Tabelas
- **users**: Usuários do sistema
- **posts**: Posts dos usuários

### Views
- **posts_with_users**: Posts com informações dos autores

## 🔧 Comandos Úteis

### Docker
```bash
# Parar containers
docker-compose down

# Parar e remover volumes (limpa banco)
docker-compose down -v

# Ver logs dos containers
docker-compose logs

# Recriar containers
docker-compose up -d --build
```

### Desenvolvimento
```bash
# Backend em modo desenvolvimento
cd poc-backend && npm run dev

# Frontend em modo desenvolvimento
cd poc-frontend && npm start

# Instalar nova dependência no backend
cd poc-backend && npm install nome-da-dependencia

# Instalar nova dependência no frontend
cd poc-frontend && npm install nome-da-dependencia
```

## 📁 Estrutura de Pastas Detalhada

### Backend (poc-backend)
```
poc-backend/
├── config/           # Configurações
├── controllers/      # Controladores
├── middleware/       # Middlewares
├── models/          # Modelos de dados
├── routes/          # Rotas da API
├── server.js        # Arquivo principal
├── .env             # Variáveis de ambiente
└── package.json     # Dependências
```

### Frontend (poc-frontend)
```
poc-frontend/
├── public/          # Arquivos públicos
├── src/
│   ├── components/  # Componentes React
│   ├── App.js       # Componente principal
│   ├── index.js     # Ponto de entrada
│   └── index.css    # Estilos Tailwind
├── tailwind.config.js # Configuração Tailwind
└── package.json     # Dependências
```

## 🐛 Solução de Problemas

### Erro de Conexão com MySQL
```bash
# Verificar se o container está rodando
docker-compose ps

# Reiniciar container MySQL
docker-compose restart mysql

# Ver logs do MySQL
docker-compose logs mysql
```

### Erro de CORS
O CORS já está configurado no backend. Se houver problemas, verifique se o frontend está acessando `http://localhost:3001`.

### Problemas com Tailwind
```bash
# Reinstalar dependências do Tailwind
cd poc-frontend
npm install -D tailwindcss postcss autoprefixer

# Verificar configuração
cat tailwind.config.js
```

## 📞 Próximos Passos

1. **Autenticação**: Implementar sistema de login
2. **CRUD Completo**: Adicionar operações de criação, leitura, atualização e exclusão
3. **Validação**: Implementar validação de dados
4. **Testes**: Adicionar testes unitários e de integração
5. **Deploy**: Configurar para produção

## 🤝 Contribuindo

Este é um projeto de POC para demonstração. Sinta-se à vontade para usar como base para seus projetos!

---

**Desenvolvido com ❤️ para aprendizado e desenvolvimento** 
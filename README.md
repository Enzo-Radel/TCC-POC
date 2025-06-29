# 🚀 POC - Ambiente de Desenvolvimento React + Node.js + MySQL (TypeScript)

Este projeto é uma prova de conceito (POC) que demonstra um ambiente de desenvolvimento completo usando React, Node.js, MySQL e Tailwind CSS. **O projeto foi convertido para TypeScript para melhor tipagem e experiência de desenvolvimento.**

## 📋 Tecnologias Utilizadas

- **Frontend**: React 18 + **TypeScript** + Tailwind CSS
- **Backend**: Node.js + Express.js + **TypeScript**
- **Banco de Dados**: MySQL 8.0
- **Containerização**: Docker + Docker Compose
- **Gerenciamento de Banco**: phpMyAdmin
- **Tipagem**: TypeScript com strict mode habilitado

## 🏗️ Estrutura do Projeto

```
poc/
├── poc-frontend/          # Aplicação React TypeScript
│   ├── src/
│   │   ├── types/        # Definições de tipos TypeScript
│   │   ├── components/   # Componentes React tipados
│   │   └── App.tsx       # Componente principal
│   └── tsconfig.json     # Configuração TypeScript
├── poc-backend/           # API Node.js TypeScript
│   ├── src/              # Código fonte TypeScript
│   │   ├── types/        # Definições de tipos
│   │   ├── models/       # Modelos tipados
│   │   ├── controllers/  # Controllers tipados
│   │   └── server.ts     # Servidor principal
│   ├── dist/             # Código JavaScript compilado
│   └── tsconfig.json     # Configuração TypeScript
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
# Compilar TypeScript
npm run build
# Executar em desenvolvimento com watch
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
- **Tipagem TypeScript** para props e estados
- **Componentes React.FC** tipados

## 🔷 Recursos do TypeScript

### Backend
- **Modelos tipados** para todas as entidades
- **Controllers com tipagem de Request/Response**
- **DTOs para validação de entrada**
- **Rotas tipadas** com parâmetros validados
- **IntelliSense completo** durante desenvolvimento

### Frontend  
- **Componentes React totalmente tipados**
- **Props interfaces** para todos os componentes
- **Estados tipados** com useState
- **Eventos de formulário tipados**
- **API responses tipadas**

### Benefícios da Conversão
- 🛡️ **Detecção de erros** em tempo de compilação
- 🚀 **Melhor experiência de desenvolvimento** com autocomplete
- 📚 **Código autodocumentado** através dos tipos
- 🔧 **Refatoração mais segura**
- 🐛 **Redução significativa de bugs**

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
# Backend - Compilar TypeScript
cd poc-backend && npm run build

# Backend em modo desenvolvimento (com watch)
cd poc-backend && npm run dev

# Frontend em modo desenvolvimento
cd poc-frontend && npm start

# Verificar tipos TypeScript (backend)
cd poc-backend && npx tsc --noEmit

# Verificar tipos TypeScript (frontend)
cd poc-frontend && npx tsc --noEmit

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
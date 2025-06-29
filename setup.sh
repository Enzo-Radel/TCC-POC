#!/bin/bash

# Script de configuração automática do ambiente POC
# React + Node.js + MySQL + Tailwind CSS

echo "🚀 Iniciando configuração do ambiente POC..."
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado!"
    print_info "Instale Node.js (versão 16+) em: https://nodejs.org/"
    exit 1
fi

print_status "Node.js encontrado: $(node --version)"

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm não está instalado!"
    exit 1
fi

print_status "npm encontrado: $(npm --version)"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    print_warning "Docker não encontrado!"
    print_info "Para usar MySQL via Docker, instale Docker em: https://docker.com/"
    print_info "Continuando sem Docker..."
    DOCKER_AVAILABLE=false
else
    print_status "Docker encontrado: $(docker --version)"
    DOCKER_AVAILABLE=true
fi

echo ""
echo "📦 Instalando dependências do backend..."
cd poc-backend
if npm install; then
    print_status "Dependências do backend instaladas com sucesso!"
else
    print_error "Erro ao instalar dependências do backend!"
    exit 1
fi

echo ""
echo "📦 Instalando dependências do frontend..."
cd ../poc-frontend
if npm install; then
    print_status "Dependências do frontend instaladas com sucesso!"
else
    print_error "Erro ao instalar dependências do frontend!"
    exit 1
fi

echo ""
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🐳 Configurando MySQL com Docker..."
    cd ..
    
    print_info "Iniciando containers MySQL e phpMyAdmin..."
    if docker-compose up -d; then
        print_status "Containers iniciados com sucesso!"
        print_info "Aguardando MySQL inicializar..."
        sleep 10
        
        # Verificar se o container MySQL está rodando
        if docker-compose ps | grep -q "poc_mysql.*Up"; then
            print_status "MySQL está rodando!"
        else
            print_warning "MySQL pode não estar totalmente inicializado ainda"
        fi
    else
        print_error "Erro ao iniciar containers Docker!"
        print_info "Você pode tentar manualmente: docker-compose up -d"
    fi
else
    print_warning "Docker não disponível - MySQL precisa ser configurado manualmente"
    print_info "Instale MySQL e configure com as credenciais do arquivo .env"
fi

echo ""
echo "🎉 Configuração concluída!"
echo "=================================="
echo ""
print_info "Para executar a aplicação:"
echo ""
echo "1️⃣  Backend (Terminal 1):"
echo "   cd poc-backend && npm run dev"
echo ""
echo "2️⃣  Frontend (Terminal 2):"
echo "   cd poc-frontend && npm start"
echo ""
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🌐 URLs disponíveis:"
    echo "   Frontend:    http://localhost:3000"
    echo "   Backend:     http://localhost:3001"
    echo "   phpMyAdmin:  http://localhost:8080"
    echo ""
    echo "🔑 Credenciais MySQL:"
    echo "   Host:     localhost"
    echo "   Usuário:  root"
    echo "   Senha:    root123"
    echo "   Banco:    poc_database"
fi
echo ""
print_status "Ambiente POC configurado com sucesso! 🚀"
echo ""

# Perguntar se o usuário quer executar os serviços
read -p "Deseja executar o backend agora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Iniciando backend..."
    cd poc-backend
    exec npm run dev
fi 
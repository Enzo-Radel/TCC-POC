const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'poc_database',
  port: process.env.DB_PORT || 3306
};

// Teste de conexão com o banco
async function testDatabaseConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error.message);
  }
}

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: 'POC Backend está funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    service: 'POC Backend',
    version: '1.0.0'
  });
});

// Exemplo de rota com banco de dados
app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT 1 as test');
    await connection.end();
    
    res.json({ 
      success: true,
      message: 'Conexão com banco de dados OK',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Erro ao conectar com banco de dados',
      error: error.message
    });
  }
});

// Importando as rotas
const categoriasRoutes = require('./routes/categorias');
const investimentosRoutes = require('./routes/investimentos');
const aportesRoutes = require('./routes/aportes');
const retiradasRoutes = require('./routes/retiradas');

// Usando as rotas
app.use('/api/categorias', categoriasRoutes);
app.use('/api/investimentos', investimentosRoutes);
app.use('/api/aportes', aportesRoutes);
app.use('/api/retiradas', retiradasRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  testDatabaseConnection();
}); 
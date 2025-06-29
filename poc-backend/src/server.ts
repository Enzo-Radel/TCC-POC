import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { dbConfig } from './models/database';

// Importando as rotas
import categoriasRoutes from './routes/categorias';
import investimentosRoutes from './routes/investimentos';
import aportesRoutes from './routes/aportes';
import retiradasRoutes from './routes/retiradas';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Teste de conexão com o banco
async function testDatabaseConnection(): Promise<void> {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error instanceof Error ? error.message : 'Erro desconhecido');
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
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

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
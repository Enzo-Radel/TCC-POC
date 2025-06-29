const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'poc_user',
  password: process.env.DB_PASSWORD || 'poc_password',
  database: process.env.DB_NAME || 'poc_database',
  port: process.env.DB_PORT || 3306
};

async function getConnection() {
  try {
    return await mysql.createConnection(dbConfig);
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    throw error;
  }
}

module.exports = { getConnection }; 
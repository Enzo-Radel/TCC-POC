import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { DbConfig } from '../types';

dotenv.config();

const dbConfig: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'poc_user',
  password: process.env.DB_PASSWORD || 'poc_password',
  database: process.env.DB_NAME || 'poc_database',
  port: parseInt(process.env.DB_PORT || '3306', 10)
};

export async function getConnection(): Promise<mysql.Connection> {
  try {
    return await mysql.createConnection(dbConfig);
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    throw error;
  }
}

export { dbConfig }; 
import { getConnection } from './database';
import { 
  Categoria, 
  CreateCategoriaDto, 
  UpdateCategoriaDto,
  DatabaseResult 
} from '../types';

export class CategoriaModel {
  static async findAll(): Promise<Categoria[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<Categoria[]>(
        'SELECT * FROM categorias ORDER BY nome'
      );
      return rows;
    } finally {
      await connection.end();
    }
  }

  static async findById(id: number): Promise<Categoria | undefined> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<Categoria[]>(
        'SELECT * FROM categorias WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      await connection.end();
    }
  }

  static async create(data: CreateCategoriaDto): Promise<Categoria> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<DatabaseResult>(
        'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
        [data.nome, data.descricao || null]
      );
      return { 
        id: result.insertId, 
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      } as Categoria;
    } finally {
      await connection.end();
    }
  }

  static async update(id: number, data: UpdateCategoriaDto): Promise<boolean> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<DatabaseResult>(
        'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
        [data.nome, data.descricao || null, id]
      );
      return result.affectedRows > 0;
    } finally {
      await connection.end();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<DatabaseResult>(
        'DELETE FROM categorias WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      await connection.end();
    }
  }
} 
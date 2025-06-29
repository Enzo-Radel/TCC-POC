import { getConnection } from './database';
import { 
  Retirada, 
  RetiradaCompleta, 
  CreateRetiradaDto, 
  UpdateRetiradaDto,
  DatabaseResult 
} from '../types';

export class RetiradaModel {
  static async findAll(): Promise<RetiradaCompleta[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<RetiradaCompleta[]>(
        `SELECT r.*, i.titulo as investimento_titulo, c.nome as investimento_categoria
         FROM retiradas r 
         LEFT JOIN investimentos i ON r.investimento_id = i.id 
         LEFT JOIN categorias c ON i.categoria_id = c.id
         ORDER BY r.data_retirada DESC`
      );
      return rows;
    } finally {
      await connection.end();
    }
  }

  static async findById(id: number): Promise<RetiradaCompleta | undefined> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<RetiradaCompleta[]>(
        `SELECT r.*, i.titulo as investimento_titulo, c.nome as investimento_categoria
         FROM retiradas r 
         LEFT JOIN investimentos i ON r.investimento_id = i.id 
         LEFT JOIN categorias c ON i.categoria_id = c.id
         WHERE r.id = ?`,
        [id]
      );
      return rows[0];
    } finally {
      await connection.end();
    }
  }

  static async findByInvestimento(investimentoId: number): Promise<RetiradaCompleta[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<RetiradaCompleta[]>(
        `SELECT r.*, i.titulo as investimento_titulo, c.nome as investimento_categoria
         FROM retiradas r 
         LEFT JOIN investimentos i ON r.investimento_id = i.id 
         LEFT JOIN categorias c ON i.categoria_id = c.id
         WHERE r.investimento_id = ? 
         ORDER BY r.data_retirada DESC`,
        [investimentoId]
      );
      return rows;
    } finally {
      await connection.end();
    }
  }

  static async create(data: CreateRetiradaDto): Promise<Retirada> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<DatabaseResult>(
        'INSERT INTO retiradas (investimento_id, valor, data_retirada, observacoes) VALUES (?, ?, ?, ?)',
        [
          data.investimento_id,
          data.valor,
          data.data_retirada || new Date().toISOString().split('T')[0],
          data.observacoes || null
        ]
      );
      return { 
        id: result.insertId, 
        ...data,
        data_retirada: new Date(data.data_retirada || new Date()),
        created_at: new Date(),
        updated_at: new Date()
      } as Retirada;
    } finally {
      await connection.end();
    }
  }

  static async update(id: number, data: UpdateRetiradaDto): Promise<boolean> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<DatabaseResult>(
        'UPDATE retiradas SET valor = ?, data_retirada = ?, observacoes = ? WHERE id = ?',
        [data.valor, data.data_retirada, data.observacoes || null, id]
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
        'DELETE FROM retiradas WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      await connection.end();
    }
  }

  static async getTotalByInvestimento(investimentoId: number): Promise<number> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT COALESCE(SUM(valor), 0) as total FROM retiradas WHERE investimento_id = ?',
        [investimentoId]
      ) as [Array<{ total: number }>, any];
      return rows[0]?.total || 0;
    } finally {
      await connection.end();
    }
  }
} 
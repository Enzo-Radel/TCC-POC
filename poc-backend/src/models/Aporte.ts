import { getConnection } from './database';
import { 
  Aporte, 
  AporteCompleto, 
  CreateAporteDto, 
  UpdateAporteDto,
  DatabaseResult 
} from '../types';

export class AporteModel {
  static async findAll(): Promise<AporteCompleto[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<AporteCompleto[]>(
        `SELECT a.*, i.titulo as investimento_titulo 
         FROM aportes a 
         LEFT JOIN investimentos i ON a.investimento_id = i.id 
         ORDER BY a.data_aporte DESC`
      );
      return rows;
    } finally {
      await connection.end();
    }
  }

  static async findById(id: number): Promise<AporteCompleto | undefined> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<AporteCompleto[]>(
        `SELECT a.*, i.titulo as investimento_titulo 
         FROM aportes a 
         LEFT JOIN investimentos i ON a.investimento_id = i.id 
         WHERE a.id = ?`,
        [id]
      );
      return rows[0];
    } finally {
      await connection.end();
    }
  }

  static async findByInvestimento(investimentoId: number): Promise<AporteCompleto[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<AporteCompleto[]>(
        `SELECT a.*, i.titulo as investimento_titulo 
         FROM aportes a 
         LEFT JOIN investimentos i ON a.investimento_id = i.id 
         WHERE a.investimento_id = ? 
         ORDER BY a.data_aporte DESC`,
        [investimentoId]
      );
      return rows;
    } finally {
      await connection.end();
    }
  }

  static async create(data: CreateAporteDto): Promise<Aporte> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<DatabaseResult>(
        'INSERT INTO aportes (investimento_id, valor, data_aporte, observacoes) VALUES (?, ?, ?, ?)',
        [
          data.investimento_id,
          data.valor,
          data.data_aporte || new Date().toISOString().split('T')[0],
          data.observacoes || null
        ]
      );
      return { 
        id: result.insertId, 
        ...data,
        data_aporte: new Date(data.data_aporte || new Date()),
        created_at: new Date(),
        updated_at: new Date()
      } as Aporte;
    } finally {
      await connection.end();
    }
  }

  static async update(id: number, data: UpdateAporteDto): Promise<boolean> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<DatabaseResult>(
        'UPDATE aportes SET valor = ?, data_aporte = ?, observacoes = ? WHERE id = ?',
        [data.valor, data.data_aporte, data.observacoes || null, id]
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
        'DELETE FROM aportes WHERE id = ?',
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
        'SELECT COALESCE(SUM(valor), 0) as total FROM aportes WHERE investimento_id = ?',
        [investimentoId]
      ) as [Array<{ total: number }>, any];
      return rows[0]?.total || 0;
    } finally {
      await connection.end();
    }
  }
} 
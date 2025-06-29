import { getConnection } from './database';
import { 
  Investimento, 
  InvestimentoCompleto, 
  CreateInvestimentoDto, 
  UpdateInvestimentoDto,
  DatabaseResult 
} from '../types';

export class InvestimentoModel {
  static async findAll(): Promise<InvestimentoCompleto[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<InvestimentoCompleto[]>(
        'SELECT * FROM investimentos_completos ORDER BY created_at DESC'
      );
      return rows;
    } finally {
      await connection.end();
    }
  }

  static async findById(id: number): Promise<InvestimentoCompleto | undefined> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<InvestimentoCompleto[]>(
        'SELECT * FROM investimentos_completos WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      await connection.end();
    }
  }

  static async create(data: CreateInvestimentoDto): Promise<Investimento> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<DatabaseResult>(
        `INSERT INTO investimentos 
         (titulo, data_vencimento, tipo_taxa_juros, rentabilidade, indices, porcentagem_do_indice, categoria_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.titulo,
          data.data_vencimento,
          data.tipo_taxa_juros,
          data.rentabilidade || 0,
          data.indices || null,
          data.porcentagem_do_indice || null,
          data.categoria_id
        ]
      );
      return { 
        id: result.insertId, 
        ...data,
        data_vencimento: new Date(data.data_vencimento),
        created_at: new Date(),
        updated_at: new Date()
      } as Investimento;
    } finally {
      await connection.end();
    }
  }

  static async update(id: number, data: UpdateInvestimentoDto): Promise<boolean> {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute<DatabaseResult>(
        `UPDATE investimentos 
         SET titulo = ?, data_vencimento = ?, tipo_taxa_juros = ?, 
             rentabilidade = ?, indices = ?, porcentagem_do_indice = ?, categoria_id = ?
         WHERE id = ?`,
        [
          data.titulo,
          data.data_vencimento,
          data.tipo_taxa_juros,
          data.rentabilidade || 0,
          data.indices || null,
          data.porcentagem_do_indice || null,
          data.categoria_id,
          id
        ]
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
        'DELETE FROM investimentos WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      await connection.end();
    }
  }

  static async findByCategoria(categoriaId: number): Promise<InvestimentoCompleto[]> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute<InvestimentoCompleto[]>(
        'SELECT * FROM investimentos_completos WHERE categoria_id = ? ORDER BY created_at DESC',
        [categoriaId]
      );
      return rows;
    } finally {
      await connection.end();
    }
  }
} 
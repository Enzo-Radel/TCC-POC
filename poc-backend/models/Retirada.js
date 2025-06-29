const db = require('./database');

class Retirada {
  constructor(investimento_id, valor, data_retirada, observacoes) {
    this.investimento_id = investimento_id;
    this.valor = valor;
    this.data_retirada = data_retirada;
    this.observacoes = observacoes;
  }

  static async getAll(investimento_id = null) {
    try {
      let query;
      let params = [];

      if (investimento_id) {
        query = `
          SELECT 
            r.*,
            i.titulo as investimento_titulo,
            c.nome as investimento_categoria
          FROM retiradas r
          LEFT JOIN investimentos i ON r.investimento_id = i.id
          LEFT JOIN categorias c ON i.categoria_id = c.id
          WHERE r.investimento_id = ?
          ORDER BY r.data_retirada DESC
        `;
        params = [investimento_id];
      } else {
        query = `
          SELECT 
            r.*,
            i.titulo as investimento_titulo,
            c.nome as investimento_categoria
          FROM retiradas r
          LEFT JOIN investimentos i ON r.investimento_id = i.id
          LEFT JOIN categorias c ON i.categoria_id = c.id
          ORDER BY r.data_retirada DESC
        `;
      }

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Erro ao buscar retiradas:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT 
          r.*,
          i.titulo as investimento_titulo,
          c.nome as investimento_categoria
        FROM retiradas r
        LEFT JOIN investimentos i ON r.investimento_id = i.id
        LEFT JOIN categorias c ON i.categoria_id = c.id
        WHERE r.id = ?
      `;
      const [rows] = await db.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar retirada por ID:', error);
      throw error;
    }
  }

  async save() {
    try {
      const query = `
        INSERT INTO retiradas (investimento_id, valor, data_retirada, observacoes)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await db.execute(query, [
        this.investimento_id,
        this.valor,
        this.data_retirada,
        this.observacoes
      ]);
      
      this.id = result.insertId;
      return this;
    } catch (error) {
      console.error('Erro ao salvar retirada:', error);
      throw error;
    }
  }

  static async update(id, dadosRetirada) {
    try {
      const { investimento_id, valor, data_retirada, observacoes } = dadosRetirada;
      
      const query = `
        UPDATE retiradas 
        SET investimento_id = ?, valor = ?, data_retirada = ?, observacoes = ?
        WHERE id = ?
      `;
      
      const [result] = await db.execute(query, [
        investimento_id,
        valor,
        data_retirada,
        observacoes,
        id
      ]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao atualizar retirada:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM retiradas WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro ao deletar retirada:', error);
      throw error;
    }
  }

  static async getTotalByInvestimento(investimento_id) {
    try {
      const query = `
        SELECT COALESCE(SUM(valor), 0) as total
        FROM retiradas 
        WHERE investimento_id = ?
      `;
      const [rows] = await db.execute(query, [investimento_id]);
      return rows[0]?.total || 0;
    } catch (error) {
      console.error('Erro ao calcular total de retiradas:', error);
      throw error;
    }
  }

  static async validateRetirada(investimento_id, valor) {
    try {
      // Verificar se existe saldo suficiente para retirada
      const queryAportes = `
        SELECT COALESCE(SUM(valor), 0) as total_aportes
        FROM aportes 
        WHERE investimento_id = ?
      `;
      const [aportesRows] = await db.execute(queryAportes, [investimento_id]);
      
      const queryRetiradas = `
        SELECT COALESCE(SUM(valor), 0) as total_retiradas
        FROM retiradas 
        WHERE investimento_id = ?
      `;
      const [retiradasRows] = await db.execute(queryRetiradas, [investimento_id]);
      
      const totalAportes = aportesRows[0]?.total_aportes || 0;
      const totalRetiradas = retiradasRows[0]?.total_retiradas || 0;
      const saldoAtual = totalAportes - totalRetiradas;
      
      return {
        valid: valor <= saldoAtual,
        saldoAtual,
        totalAportes,
        totalRetiradas
      };
    } catch (error) {
      console.error('Erro ao validar retirada:', error);
      throw error;
    }
  }
}

module.exports = Retirada; 
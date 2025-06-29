const { getConnection } = require('./database');

class Aporte {
  static async findAll() {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
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

  static async findById(id) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
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

  static async findByInvestimento(investimentoId) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
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

  static async create(data) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO aportes (investimento_id, valor, data_aporte, observacoes) VALUES (?, ?, ?, ?)',
        [
          data.investimento_id,
          data.valor,
          data.data_aporte || new Date().toISOString().split('T')[0],
          data.observacoes || null
        ]
      );
      return { id: result.insertId, ...data };
    } finally {
      await connection.end();
    }
  }

  static async update(id, data) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'UPDATE aportes SET investimento_id = ?, valor = ?, data_aporte = ?, observacoes = ? WHERE id = ?',
        [data.investimento_id, data.valor, data.data_aporte, data.observacoes || null, id]
      );
      return result.affectedRows > 0;
    } finally {
      await connection.end();
    }
  }

  static async delete(id) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM aportes WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      await connection.end();
    }
  }

  static async getTotalByInvestimento(investimentoId) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT COALESCE(SUM(valor), 0) as total FROM aportes WHERE investimento_id = ?',
        [investimentoId]
      );
      return rows[0].total;
    } finally {
      await connection.end();
    }
  }
}

module.exports = Aporte; 
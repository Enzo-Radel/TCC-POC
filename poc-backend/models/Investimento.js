const { getConnection } = require('./database');

class Investimento {
  static async findAll() {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM investimentos_completos ORDER BY created_at DESC'
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
        'SELECT * FROM investimentos_completos WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      await connection.end();
    }
  }

  static async create(data) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
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
      return { id: result.insertId, ...data };
    } finally {
      await connection.end();
    }
  }

  static async update(id, data) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
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

  static async delete(id) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM investimentos WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      await connection.end();
    }
  }

  static async findByCategoria(categoriaId) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM investimentos_completos WHERE categoria_id = ? ORDER BY created_at DESC',
        [categoriaId]
      );
      return rows;
    } finally {
      await connection.end();
    }
  }
}

module.exports = Investimento; 
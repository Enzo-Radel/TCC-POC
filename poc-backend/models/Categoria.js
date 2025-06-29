const { getConnection } = require('./database');

class Categoria {
  static async findAll() {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM categorias ORDER BY nome'
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
        'SELECT * FROM categorias WHERE id = ?',
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
        'INSERT INTO categorias (nome) VALUES (?)',
        [data.nome]
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
        'UPDATE categorias SET nome = ? WHERE id = ?',
        [data.nome, id]
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
        'DELETE FROM categorias WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      await connection.end();
    }
  }
}

module.exports = Categoria; 
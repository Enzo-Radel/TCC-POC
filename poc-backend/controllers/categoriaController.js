const Categoria = require('../models/Categoria');

class CategoriaController {
  // GET /api/categorias
  static async index(req, res) {
    try {
      const categorias = await Categoria.findAll();
      res.json({
        success: true,
        data: categorias
      });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // GET /api/categorias/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findById(id);
      
      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.json({
        success: true,
        data: categoria
      });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // POST /api/categorias
  static async store(req, res) {
    try {
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome da categoria é obrigatório'
        });
      }

      const categoria = await Categoria.create({ nome });
      
      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: categoria
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com este nome'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // PUT /api/categorias/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({
          success: false,
          message: 'Nome da categoria é obrigatório'
        });
      }

      const updated = await Categoria.update(id, { nome });
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Categoria atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com este nome'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // DELETE /api/categorias/:id
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Categoria.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Categoria removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({
          success: false,
          message: 'Não é possível remover categoria que possui investimentos associados'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

module.exports = CategoriaController; 
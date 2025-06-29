const Investimento = require('../models/Investimento');

class InvestimentoController {
  // GET /api/investimentos
  static async index(req, res) {
    try {
      const { categoria_id } = req.query;
      
      let investimentos;
      if (categoria_id) {
        investimentos = await Investimento.findByCategoria(categoria_id);
      } else {
        investimentos = await Investimento.findAll();
      }

      res.json({
        success: true,
        data: investimentos
      });
    } catch (error) {
      console.error('Erro ao buscar investimentos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // GET /api/investimentos/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const investimento = await Investimento.findById(id);
      
      if (!investimento) {
        return res.status(404).json({
          success: false,
          message: 'Investimento não encontrado'
        });
      }

      res.json({
        success: true,
        data: investimento
      });
    } catch (error) {
      console.error('Erro ao buscar investimento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // POST /api/investimentos
  static async store(req, res) {
    try {
      const {
        titulo,
        data_vencimento,
        tipo_taxa_juros,
        rentabilidade,
        indices,
        porcentagem_do_indice,
        categoria_id
      } = req.body;

      // Validações básicas
      if (!titulo || !data_vencimento || !categoria_id) {
        return res.status(400).json({
          success: false,
          message: 'Título, data de vencimento e categoria são obrigatórios'
        });
      }

      // Validações específicas por tipo de taxa
      if (tipo_taxa_juros === 'porcentagem' || tipo_taxa_juros === 'mista') {
        if (!rentabilidade || rentabilidade <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Rentabilidade é obrigatória para taxa de juros de porcentagem ou mista'
          });
        }
      }

      if (tipo_taxa_juros === 'indice' || tipo_taxa_juros === 'mista') {
        if (!indices || !porcentagem_do_indice) {
          return res.status(400).json({
            success: false,
            message: 'Índice e porcentagem do índice são obrigatórios para taxa de juros de índice ou mista'
          });
        }
      }

      const investimento = await Investimento.create({
        titulo,
        data_vencimento,
        tipo_taxa_juros: tipo_taxa_juros || 'porcentagem',
        rentabilidade,
        indices,
        porcentagem_do_indice,
        categoria_id
      });
      
      res.status(201).json({
        success: true,
        message: 'Investimento criado com sucesso',
        data: investimento
      });
    } catch (error) {
      console.error('Erro ao criar investimento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // PUT /api/investimentos/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const {
        titulo,
        data_vencimento,
        tipo_taxa_juros,
        rentabilidade,
        indices,
        porcentagem_do_indice,
        categoria_id
      } = req.body;

      // Validações básicas
      if (!titulo || !data_vencimento || !categoria_id) {
        return res.status(400).json({
          success: false,
          message: 'Título, data de vencimento e categoria são obrigatórios'
        });
      }

      // Validações específicas por tipo de taxa
      if (tipo_taxa_juros === 'porcentagem' || tipo_taxa_juros === 'mista') {
        if (!rentabilidade || rentabilidade <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Rentabilidade é obrigatória para taxa de juros de porcentagem ou mista'
          });
        }
      }

      if (tipo_taxa_juros === 'indice' || tipo_taxa_juros === 'mista') {
        if (!indices || !porcentagem_do_indice) {
          return res.status(400).json({
            success: false,
            message: 'Índice e porcentagem do índice são obrigatórios para taxa de juros de índice ou mista'
          });
        }
      }

      const updated = await Investimento.update(id, {
        titulo,
        data_vencimento,
        tipo_taxa_juros,
        rentabilidade,
        indices,
        porcentagem_do_indice,
        categoria_id
      });
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Investimento não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Investimento atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar investimento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // DELETE /api/investimentos/:id
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Investimento.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Investimento não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Investimento removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover investimento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

module.exports = InvestimentoController; 
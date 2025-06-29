const Aporte = require('../models/Aporte');

class AporteController {
  // GET /api/aportes
  static async index(req, res) {
    try {
      const { investimento_id } = req.query;
      
      let aportes;
      if (investimento_id) {
        aportes = await Aporte.findByInvestimento(investimento_id);
      } else {
        aportes = await Aporte.findAll();
      }

      res.json({
        success: true,
        data: aportes
      });
    } catch (error) {
      console.error('Erro ao buscar aportes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // GET /api/aportes/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const aporte = await Aporte.findById(id);
      
      if (!aporte) {
        return res.status(404).json({
          success: false,
          message: 'Aporte não encontrado'
        });
      }

      res.json({
        success: true,
        data: aporte
      });
    } catch (error) {
      console.error('Erro ao buscar aporte:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // POST /api/aportes
  static async store(req, res) {
    try {
      const { investimento_id, valor, data_aporte } = req.body;

      // Validações básicas
      if (!investimento_id || !valor) {
        return res.status(400).json({
          success: false,
          message: 'Investimento e valor são obrigatórios'
        });
      }

      if (valor <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor deve ser maior que zero'
        });
      }

      const aporte = await Aporte.create({
        investimento_id,
        valor,
        data_aporte: data_aporte || new Date().toISOString().split('T')[0]
      });
      
      res.status(201).json({
        success: true,
        message: 'Aporte registrado com sucesso',
        data: aporte
      });
    } catch (error) {
      console.error('Erro ao criar aporte:', error);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          message: 'Investimento não encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // PUT /api/aportes/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { investimento_id, valor, data_aporte } = req.body;

      // Validações básicas
      if (!investimento_id || !valor || !data_aporte) {
        return res.status(400).json({
          success: false,
          message: 'Investimento, valor e data do aporte são obrigatórios'
        });
      }

      if (valor <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valor deve ser maior que zero'
        });
      }

      const updated = await Aporte.update(id, {
        investimento_id,
        valor,
        data_aporte
      });
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Aporte não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Aporte atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar aporte:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // DELETE /api/aportes/:id
  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Aporte.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Aporte não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Aporte removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover aporte:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // GET /api/aportes/total/:investimento_id
  static async getTotalByInvestimento(req, res) {
    try {
      const { investimento_id } = req.params;
      const total = await Aporte.getTotalByInvestimento(investimento_id);

      res.json({
        success: true,
        data: { total }
      });
    } catch (error) {
      console.error('Erro ao buscar total de aportes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

module.exports = AporteController; 
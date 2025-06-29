const Retirada = require('../models/Retirada');

// Listar todas as retiradas ou filtrar por investimento
const getRetiradas = async (req, res) => {
  try {
    const { investimento_id } = req.query;
    const retiradas = await Retirada.getAll(investimento_id || null);
    
    res.json({
      success: true,
      message: 'Retiradas listadas com sucesso',
      data: retiradas
    });
  } catch (error) {
    console.error('Erro no controller getRetiradas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Buscar retirada por ID
const getRetiradaById = async (req, res) => {
  try {
    const { id } = req.params;
    const retirada = await Retirada.getById(id);
    
    if (!retirada) {
      return res.status(404).json({
        success: false,
        message: 'Retirada não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Retirada encontrada',
      data: retirada
    });
  } catch (error) {
    console.error('Erro no controller getRetiradaById:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Criar nova retirada
const createRetirada = async (req, res) => {
  try {
    const { investimento_id, valor, data_retirada, observacoes } = req.body;
    
    // Validações básicas
    if (!investimento_id) {
      return res.status(400).json({
        success: false,
        message: 'ID do investimento é obrigatório'
      });
    }
    
    if (!valor || valor <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor deve ser maior que zero'
      });
    }
    
    if (!data_retirada) {
      return res.status(400).json({
        success: false,
        message: 'Data da retirada é obrigatória'
      });
    }
    
    // Validar se há saldo suficiente para retirada
    const validacao = await Retirada.validateRetirada(investimento_id, valor);
    
    if (!validacao.valid) {
      return res.status(400).json({
        success: false,
        message: `Saldo insuficiente. Saldo atual: R$ ${validacao.saldoAtual.toFixed(2)}. Valor solicitado: R$ ${valor.toFixed(2)}`,
        data: {
          saldoAtual: validacao.saldoAtual,
          totalAportes: validacao.totalAportes,
          totalRetiradas: validacao.totalRetiradas,
          valorSolicitado: valor
        }
      });
    }
    
    // Criar nova retirada
    const novaRetirada = new Retirada(
      investimento_id,
      valor,
      data_retirada,
      observacoes || null
    );
    
    const retiradaSalva = await novaRetirada.save();
    
    res.status(201).json({
      success: true,
      message: 'Retirada registrada com sucesso',
      data: retiradaSalva
    });
    
  } catch (error) {
    console.error('Erro no controller createRetirada:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Atualizar retirada
const updateRetirada = async (req, res) => {
  try {
    const { id } = req.params;
    const { investimento_id, valor, data_retirada, observacoes } = req.body;
    
    // Verificar se a retirada existe
    const retiradaExistente = await Retirada.getById(id);
    if (!retiradaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Retirada não encontrada'
      });
    }
    
    // Validações básicas
    if (investimento_id && !investimento_id) {
      return res.status(400).json({
        success: false,
        message: 'ID do investimento é obrigatório'
      });
    }
    
    if (valor !== undefined && valor <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor deve ser maior que zero'
      });
    }
    
    // Se o valor foi alterado, validar saldo
    if (valor && valor !== retiradaExistente.valor) {
      const diferenca = valor - retiradaExistente.valor;
      
      if (diferenca > 0) {
        // Aumento na retirada - verificar se há saldo
        const validacao = await Retirada.validateRetirada(investimento_id || retiradaExistente.investimento_id, diferenca);
        
        if (!validacao.valid) {
          return res.status(400).json({
            success: false,
            message: `Saldo insuficiente para o aumento. Saldo disponível: R$ ${validacao.saldoAtual.toFixed(2)}`,
            data: validacao
          });
        }
      }
    }
    
    // Preparar dados para atualização
    const dadosAtualizacao = {
      investimento_id: investimento_id || retiradaExistente.investimento_id,
      valor: valor || retiradaExistente.valor,
      data_retirada: data_retirada || retiradaExistente.data_retirada,
      observacoes: observacoes !== undefined ? observacoes : retiradaExistente.observacoes
    };
    
    const sucesso = await Retirada.update(id, dadosAtualizacao);
    
    if (!sucesso) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar retirada'
      });
    }
    
    res.json({
      success: true,
      message: 'Retirada atualizada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no controller updateRetirada:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Deletar retirada
const deleteRetirada = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a retirada existe
    const retiradaExistente = await Retirada.getById(id);
    if (!retiradaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Retirada não encontrada'
      });
    }
    
    const sucesso = await Retirada.delete(id);
    
    if (!sucesso) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar retirada'
      });
    }
    
    res.json({
      success: true,
      message: 'Retirada deletada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no controller deleteRetirada:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Obter total de retiradas por investimento
const getTotalRetiradas = async (req, res) => {
  try {
    const { investimento_id } = req.params;
    const total = await Retirada.getTotalByInvestimento(investimento_id);
    
    res.json({
      success: true,
      message: 'Total de retiradas calculado',
      data: { total }
    });
  } catch (error) {
    console.error('Erro no controller getTotalRetiradas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

// Verificar saldo disponível para retirada
const verificarSaldo = async (req, res) => {
  try {
    const { investimento_id } = req.params;
    const { valor } = req.query;
    
    const validacao = await Retirada.validateRetirada(investimento_id, parseFloat(valor) || 0);
    
    res.json({
      success: true,
      message: 'Validação de saldo realizada',
      data: validacao
    });
  } catch (error) {
    console.error('Erro no controller verificarSaldo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
};

module.exports = {
  getRetiradas,
  getRetiradaById,
  createRetirada,
  updateRetirada,
  deleteRetirada,
  getTotalRetiradas,
  verificarSaldo
}; 
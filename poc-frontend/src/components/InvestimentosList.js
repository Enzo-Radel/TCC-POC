import React, { useState, useEffect } from 'react';

const InvestimentosList = ({ onEdit, onAddAporte, onAddNew, onViewAportes }) => {
  const [investimentos, setInvestimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchInvestimentos();
  }, []);

  const fetchInvestimentos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/investimentos');
      const data = await response.json();
      
      if (data.success) {
        setInvestimentos(data.data);
      } else {
        console.error('Erro ao carregar investimentos:', data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja excluir o investimento "${titulo}"?`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/investimentos/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          alert('Investimento excluído com sucesso!');
          fetchInvestimentos(); // Recarregar lista
        } else {
          alert('Erro ao excluir investimento: ' + data.message);
        }
      } catch (error) {
        console.error('Erro ao excluir investimento:', error);
        alert('Erro ao excluir investimento');
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTaxaJuros = (investimento) => {
    const { tipo_taxa_juros, rentabilidade, indices, porcentagem_do_indice } = investimento;
    
    switch (tipo_taxa_juros) {
      case 'porcentagem':
        return `${rentabilidade}% a.a.`;
      case 'indice':
        return `${porcentagem_do_indice}% do ${indices}`;
      case 'mista':
        return `${indices} + ${rentabilidade}%`;
      default:
        return 'N/A';
    }
  };

  const filteredInvestimentos = investimentos.filter(investimento =>
    investimento.titulo.toLowerCase().includes(filter.toLowerCase()) ||
    investimento.categoria_nome.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading">
        <p>Carregando investimentos...</p>
      </div>
    );
  }

  return (
    <div className="investimentos-list">
      <div className="investments-grid">
        {/* Card para Novo Investimento */}
        <div className="investment-card new-investment-card" onClick={onAddNew}>
          <div className="card-content">
            <div className="new-investment-content">
              <div className="plus-icon">+</div>
              <h3 className="new-investment-title">Novo Investimento</h3>
            </div>
          </div>
        </div>

        {/* Cards dos Investimentos Existentes */}
        {filteredInvestimentos.map(investimento => (
          <div 
            key={investimento.id} 
            className="investment-card clickable-card"
            onClick={() => onViewAportes(investimento)}
          >
            <div className="card-content">
              <h3 className="investment-title">{investimento.titulo}</h3>
              <div className="investment-info">
                <div className="info-item">
                  <span className="label">Valor</span>
                  <span className="value">{formatCurrency(investimento.total_aportado || 0)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Vencimento</span>
                  <span className="value">{formatDate(investimento.data_vencimento)}</span>
                </div>
              </div>
            </div>
            
            <div className="card-actions">
              <button 
                className="btn-card btn-details"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(investimento);
                }}
              >
                Editar
              </button>
              <button 
                className="btn-card btn-invest"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddAporte(investimento);
                }}
              >
                Investir
              </button>
            </div>
          </div>
        ))}

        {/* Mensagem quando não há investimentos */}
        {filteredInvestimentos.length === 0 && (
          <div className="no-investments-message">
            <p>Você ainda não possui investimentos.</p>
            <p>Clique no card acima para criar seu primeiro investimento!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestimentosList; 
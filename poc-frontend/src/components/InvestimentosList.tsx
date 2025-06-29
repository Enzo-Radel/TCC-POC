import React, { useState, useEffect } from 'react';
import { InvestimentosListProps, InvestimentoCompleto, ApiResponse } from '../types';

const InvestimentosList: React.FC<InvestimentosListProps> = ({ 
  onEdit, 
  onAddAporte, 
  onAddNew, 
  onViewAportes 
}) => {
  const [investimentos, setInvestimentos] = useState<InvestimentoCompleto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetchInvestimentos();
  }, []);

  const fetchInvestimentos = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3001/api/investimentos');
      const data: ApiResponse<InvestimentoCompleto[]> = await response.json();
      
      if (data.success && data.data) {
        setInvestimentos(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir este investimento?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/investimentos/${id}`, {
          method: 'DELETE'
        });

        const data: ApiResponse = await response.json();

        if (data.success) {
          alert(data.message);
          fetchInvestimentos();
        } else {
          alert('Erro: ' + data.message);
        }
      } catch (error) {
        console.error('Erro ao excluir investimento:', error);
        alert('Erro ao excluir investimento');
      }
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const formatTaxaJuros = (investimento: InvestimentoCompleto): string => {
    const { tipo_taxa_juros, rentabilidade, indices, porcentagem_do_indice } = investimento;
    
    switch (tipo_taxa_juros) {
      case 'porcentagem':
        return `${rentabilidade}% a.a.`;
      case 'indice':
        return `${porcentagem_do_indice}% do ${indices}`;
      case 'mista':
        return `${rentabilidade}% + ${porcentagem_do_indice}% do ${indices}`;
      default:
        return 'N/A';
    }
  };

  if (loading) {
    return <div className="loading">Carregando investimentos...</div>;
  }

  return (
    <div className="main-content">
      {investimentos.length === 0 ? (
        <div className="no-investments">
          <p className="no-investments-message">Nenhum investimento encontrado.</p>
          <div className="investments-grid">
            <div className="new-investment-card" onClick={onAddNew}>
              <div className="new-investment-content">
                <div className="plus-icon">+</div>
                <h3 className="new-investment-title">Criar Primeiro Investimento</h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="investments-grid">
          {/* Card para novo investimento */}
          <div className="new-investment-card" onClick={onAddNew}>
            <div className="new-investment-content">
              <div className="plus-icon">+</div>
              <h3 className="new-investment-title">Novo Investimento</h3>
            </div>
          </div>

          {/* Cards dos investimentos existentes */}
          {investimentos.map(investimento => (
            <div key={investimento.id} className="investment-card">
              <div className="card-content">
                <h3 className="investment-title">{investimento.titulo}</h3>
                <div className="investment-info">
                  <div className="info-item">
                    <span className="label">Categoria:</span>
                    <span className="value">{investimento.categoria_nome}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Vencimento:</span>
                    <span className="value">{formatDate(investimento.data_vencimento)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Rentabilidade:</span>
                    <span className="value">{formatTaxaJuros(investimento)}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  onClick={() => onEdit(investimento)} 
                  className="btn-card btn-details"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onAddAporte(investimento)} 
                  className="btn-card btn-invest"
                >
                  Aportar
                </button>
                {onViewAportes && (
                  <button 
                    onClick={() => onViewAportes(investimento)} 
                    className="btn-card btn-details"
                  >
                    Ver Aportes
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestimentosList; 
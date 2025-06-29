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
  const [aportesData, setAportesData] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetchInvestimentos();
  }, []);

  const fetchInvestimentos = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3001/api/investimentos');
      const data: ApiResponse<InvestimentoCompleto[]> = await response.json();
      
      if (data.success && data.data) {
        setInvestimentos(data.data);
        // Buscar aportes para cada investimento
        fetchAportesData(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAportesData = async (investimentosList: InvestimentoCompleto[]): Promise<void> => {
    const aportesMap: { [key: number]: number } = {};
    
    for (const investimento of investimentosList) {
      try {
        const response = await fetch(`http://localhost:3001/api/aportes?investimento_id=${investimento.id}`);
        const data = await response.json();
        
        if (data.success && data.data && Array.isArray(data.data)) {
          const total = data.data.reduce((sum: number, aporte: any) => {
            const valor = parseFloat(aporte.valor);
            return sum + (isNaN(valor) ? 0 : valor);
          }, 0);
          aportesMap[investimento.id] = total;
        } else {
          aportesMap[investimento.id] = 0;
        }
      } catch (error) {
        console.error(`Erro ao carregar aportes do investimento ${investimento.id}:`, error);
        aportesMap[investimento.id] = 0;
      }
    }
    
    setAportesData(aportesMap);
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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCardClick = (investimento: InvestimentoCompleto) => {
    if (onViewAportes) {
      onViewAportes(investimento);
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
            <div 
              key={investimento.id} 
              className="investment-card clickable-card" 
              onClick={() => handleCardClick(investimento)}
              title="Ver aportes"
            >
              <div className="card-content">
                <h3 className="investment-title">{investimento.titulo}</h3>
                <div className="investment-info">
                  <div className="info-item">
                    <span className="label">Valor aportado:</span>
                    <span className="value">{formatCurrency(aportesData[investimento.id] || 0)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Vencimento:</span>
                    <span className="value">{formatDate(investimento.data_vencimento)}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(investimento);
                  }} 
                  className="btn-card btn-details"
                >
                  Editar
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddAporte(investimento);
                  }} 
                  className="btn-card btn-invest"
                >
                  Aportar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestimentosList; 
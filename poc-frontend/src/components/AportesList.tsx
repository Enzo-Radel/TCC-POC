import React, { useState, useEffect } from 'react';
import { AportesListProps, AporteCompleto, ApiResponse } from '../types';

const AportesList: React.FC<AportesListProps> = ({ investimento, onBack }) => {
  const [aportes, setAportes] = useState<AporteCompleto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  // Função para calcular total de forma segura
  const calcularTotalSeguro = (listaAportes: AporteCompleto[]): number => {
    if (!Array.isArray(listaAportes) || listaAportes.length === 0) {
      return 0;
    }
    
    return listaAportes.reduce((sum, aporte) => {
      const valor = typeof aporte.valor === 'number' ? aporte.valor : parseFloat(String(aporte.valor));
      const validValue = isNaN(valor) ? 0 : valor;
      return sum + validValue;
    }, 0);
  };

  useEffect(() => {
    if (investimento) {
      fetchAportes();
    }
  }, [investimento]);

  // Recalcular total sempre que aportes mudarem
  useEffect(() => {
    const novoTotal = calcularTotalSeguro(aportes);
    setTotal(novoTotal);
  }, [aportes]);

  const fetchAportes = async (): Promise<void> => {
    if (!investimento) return;

    try {
      const response = await fetch(`http://localhost:3001/api/aportes?investimento_id=${investimento.id}`);
      const data: ApiResponse<AporteCompleto[]> = await response.json();
      
      if (data.success && data.data && Array.isArray(data.data)) {
        setAportes(data.data);
      } else {
        console.log('Dados inválidos ou vazios:', data);
        setAportes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar aportes:', error);
      setAportes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir este aporte?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/aportes/${id}`, {
          method: 'DELETE'
        });

        const data: ApiResponse = await response.json();

        if (data.success) {
          alert(data.message);
          fetchAportes();
        } else {
          alert('Erro: ' + data.message);
        }
      } catch (error) {
        console.error('Erro ao excluir aporte:', error);
        alert('Erro ao excluir aporte');
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

  const formatCurrency = (value: number | string): string => {
    let safeValue: number;
    
    if (typeof value === 'number') {
      safeValue = isNaN(value) ? 0 : value;
    } else {
      safeValue = parseFloat(String(value));
      safeValue = isNaN(safeValue) ? 0 : safeValue;
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(safeValue);
  };

  if (loading) {
    return <div className="loading">Carregando aportes...</div>;
  }

  return (
    <div className="aportes-list">
      <div className="aportes-header">
        <button onClick={onBack} className="back-btn">
          ← Voltar
        </button>
        <div className="investment-summary">
          <h2>{investimento?.titulo}</h2>
          <div className="summary-stats">
            <div className="stat">
              <div className="label">Total Investido:</div>
              <div className="value total-value">{formatCurrency(total)}</div>
            </div>
          </div>
        </div>
      </div>

      {aportes.length === 0 ? (
        <div className="no-aportes">
          <p>Nenhum aporte encontrado para este investimento.</p>
        </div>
      ) : (
        <div className="aportes-grid">
          {aportes.map(aporte => (
            <div key={aporte.id} className="aporte-card">
              <div className="aporte-content">
                <div className="aporte-value">
                  {formatCurrency(aporte.valor)}
                </div>
                <div className="aporte-date">
                  {formatDate(aporte.data_aporte)}
                </div>
                {aporte.observacoes && (
                  <div className="aporte-observacoes">
                    {aporte.observacoes}
                  </div>
                )}
              </div>
              <div className="aporte-actions">
                <button 
                  onClick={() => handleDelete(aporte.id)} 
                  className="btn btn-danger"
                  title="Excluir aporte"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AportesList; 
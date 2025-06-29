import React, { useState, useEffect } from 'react';

const AportesList = ({ investimento, onBack }) => {
  const [aportes, setAportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (investimento) {
      fetchAportes();
    }
  }, [investimento]);

  const fetchAportes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/aportes?investimento_id=${investimento.id}`);
      const data = await response.json();
      
      if (data.success) {
        setAportes(data.data);
      } else {
        console.error('Erro ao carregar aportes:', data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar aportes:', error);
    } finally {
      setLoading(false);
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

  const totalAportado = aportes.reduce((sum, aporte) => sum + parseFloat(aporte.valor), 0);

  if (loading) {
    return (
      <div className="loading">
        <p>Carregando aportes...</p>
      </div>
    );
  }

  return (
    <div className="aportes-list">
      {/* Header */}
      <div className="aportes-header">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          ← Voltar
        </button>
        <div className="investment-summary">
          <h2>{investimento.titulo}</h2>
          <div className="summary-stats">
            <div className="stat">
              <span className="label">Total Aportado</span>
              <span className="value total-value">{formatCurrency(totalAportado)}</span>
            </div>
            <div className="stat">
              <span className="label">Aportes Realizados</span>
              <span className="value">{aportes.length}</span>
            </div>
            <div className="stat">
              <span className="label">Vencimento</span>
              <span className="value">{formatDate(investimento.data_vencimento)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Aportes */}
      {aportes.length > 0 ? (
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
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-aportes">
          <p>Nenhum aporte encontrado para este investimento.</p>
        </div>
      )}
    </div>
  );
};

export default AportesList; 
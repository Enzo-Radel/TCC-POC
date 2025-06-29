import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvestimentos: 0,
    totalAportado: 0,
    categorias: [],
    investimentosRecentes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar investimentos
      const investimentosResponse = await fetch('http://localhost:3001/api/investimentos');
      const investimentosData = await investimentosResponse.json();
      
      // Buscar categorias
      const categoriasResponse = await fetch('http://localhost:3001/api/categorias');
      const categoriasData = await categoriasResponse.json();
      
      if (investimentosData.success && categoriasData.success) {
        const investimentos = investimentosData.data;
        const totalAportado = investimentos.reduce((sum, inv) => sum + parseFloat(inv.total_aportado || 0), 0);
        
        setStats({
          totalInvestimentos: investimentos.length,
          totalAportado: totalAportado,
          categorias: categoriasData.data,
          investimentosRecentes: investimentos.slice(0, 5)
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
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

  if (loading) {
    return (
      <div className="loading">
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card green">
          <h3>Total de Investimentos</h3>
          <p className="stat-number">{stats.totalInvestimentos}</p>
        </div>
        
        <div className="stat-card blue">
          <h3>Total Aportado</h3>
          <p className="stat-number">{formatCurrency(stats.totalAportado)}</p>
        </div>
        
        <div className="stat-card purple">
          <h3>Categorias</h3>
          <p className="stat-number">{stats.categorias.length}</p>
        </div>
      </div>

      {/* Seções de Informações */}
      <div className="dashboard-sections">
        {/* Investimentos Recentes */}
        <div className="dashboard-section">
          <h3>Investimentos Recentes</h3>
          {stats.investimentosRecentes.length > 0 ? (
            <div className="recent-investments">
              {stats.investimentosRecentes.map(investimento => (
                <div key={investimento.id} className="investment-item">
                  <div className="investment-info">
                    <h4>{investimento.titulo}</h4>
                    <p>Categoria: {investimento.categoria_nome}</p>
                    <p>Vencimento: {formatDate(investimento.data_vencimento)}</p>
                  </div>
                  <div className="investment-value">
                    <p>{formatCurrency(investimento.total_aportado || 0)}</p>
                    <span className="aportes-count">{investimento.total_aportes} aportes</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Nenhum investimento encontrado</p>
          )}
        </div>

        {/* Categorias */}
        <div className="dashboard-section">
          <h3>Categorias Disponíveis</h3>
          {stats.categorias.length > 0 ? (
            <div className="categories">
              {stats.categorias.map(categoria => (
                <div key={categoria.id} className="category-item">
                  <span>{categoria.nome}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Nenhuma categoria encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
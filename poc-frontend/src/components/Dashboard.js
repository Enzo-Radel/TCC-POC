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
      <div className="text-center py-16 px-8 text-text-muted">
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-text-primary text-3xl font-bold mb-8 uppercase tracking-wide">Dashboard</h2>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8">
        <div className="bg-app-card p-6 rounded-xl border border-border-primary shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] border-l-4 border-l-accent-success">
          <h3 className="text-text-secondary text-lg mb-4 font-medium">Total de Investimentos</h3>
          <p className="text-accent-success text-3xl font-bold">{stats.totalInvestimentos}</p>
        </div>
        
        <div className="bg-app-card p-6 rounded-xl border border-border-primary shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] border-l-4 border-l-accent-info">
          <h3 className="text-text-secondary text-lg mb-4 font-medium">Total Aportado</h3>
          <p className="text-accent-info text-3xl font-bold">{formatCurrency(stats.totalAportado)}</p>
        </div>
        
        <div className="bg-app-card p-6 rounded-xl border border-border-primary shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] border-l-4 border-l-accent-gold">
          <h3 className="text-text-secondary text-lg mb-4 font-medium">Categorias</h3>
          <p className="text-accent-gold text-3xl font-bold">{stats.categorias.length}</p>
        </div>
      </div>

      {/* Seções de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Investimentos Recentes */}
        <div className="bg-app-card rounded-xl border border-border-primary p-6">
          <h3 className="text-text-primary text-xl font-semibold mb-6 uppercase tracking-wide">Investimentos Recentes</h3>
          {stats.investimentosRecentes.length > 0 ? (
            <div className="space-y-4">
              {stats.investimentosRecentes.map(investimento => (
                <div key={investimento.id} className="flex justify-between items-center p-4 bg-app-input rounded-lg border border-border-light transition-all duration-300 hover:bg-app-card-hover">
                  <div className="flex-1">
                    <h4 className="text-text-primary font-semibold text-base mb-2">{investimento.titulo}</h4>
                    <p className="text-text-muted text-sm mb-1">Categoria: {investimento.categoria_nome}</p>
                    <p className="text-text-muted text-sm">Vencimento: {formatDate(investimento.data_vencimento)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-gold font-bold text-lg">{formatCurrency(investimento.total_aportado || 0)}</p>
                    <span className="text-text-muted text-xs">{investimento.total_aportes} aportes</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-center py-8">Nenhum investimento encontrado</p>
          )}
        </div>

        {/* Categorias */}
        <div className="bg-app-card rounded-xl border border-border-primary p-6">
          <h3 className="text-text-primary text-xl font-semibold mb-6 uppercase tracking-wide">Categorias Disponíveis</h3>
          {stats.categorias.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {stats.categorias.map(categoria => (
                <div key={categoria.id} className="bg-app-input p-3 rounded-lg border border-border-light text-center transition-all duration-300 hover:bg-app-card-hover hover:border-accent-gold">
                  <span className="text-text-secondary font-medium">{categoria.nome}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-center py-8">Nenhuma categoria encontrada</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
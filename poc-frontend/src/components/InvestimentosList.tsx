import React, { useState, useEffect } from 'react';
import { InvestimentosListProps, InvestimentoCompleto, ApiResponse } from '../types';

const InvestimentosList: React.FC<InvestimentosListProps> = ({ 
  onEdit, 
  onAddNew, 
  onViewExtrato 
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
    if (onViewExtrato) {
      onViewExtrato(investimento);
    }
  };

  if (loading) {
    return <div className="text-center py-16 px-8 text-text-muted">Carregando investimentos...</div>;
  }

  return (
    <div className="relative bg-transparent">
      {investimentos.length === 0 ? (
        <div className="text-center py-16 px-8 text-text-muted">
          <p className="text-center py-8 text-text-muted mt-4">Nenhum investimento encontrado.</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-8">
            <div className="cursor-pointer border-2 border-dashed border-border-primary bg-app-card flex items-center justify-center min-h-[200px] shadow-[0_4px_15px_rgba(0,0,0,0.4)] rounded-xl transition-all duration-300 hover:border-accent-gold hover:bg-accent-gold/5 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]" onClick={onAddNew}>
              <div className="text-center text-text-muted transition-all duration-300 hover:text-accent-gold">
                <div className="text-5xl font-bold mb-2 transition-all duration-300 hover:scale-110">+</div>
                <h3 className="text-lg font-semibold m-0 uppercase tracking-wide transition-all duration-300">Criar Primeiro Investimento</h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-8">
          {/* Card para novo investimento */}
          <div className="cursor-pointer border-2 border-dashed border-border-primary bg-app-card flex items-center justify-center min-h-[200px] shadow-[0_4px_15px_rgba(0,0,0,0.4)] rounded-xl transition-all duration-300 hover:border-accent-gold hover:bg-accent-gold/5 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]" onClick={onAddNew}>
            <div className="text-center text-text-muted transition-all duration-300 hover:text-accent-gold">
              <div className="text-5xl font-bold mb-2 transition-all duration-300 hover:scale-110">+</div>
              <h3 className="text-lg font-semibold m-0 uppercase tracking-wide transition-all duration-300">Novo Investimento</h3>
            </div>
          </div>

          {/* Cards dos investimentos existentes */}
          {investimentos.map(investimento => (
            <div 
              key={investimento.id} 
              className="bg-app-card rounded-xl p-6 border border-border-primary transition-all duration-300 relative shadow-[0_4px_15px_rgba(0,0,0,0.4)] cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] hover:border-border-hover" 
              onClick={() => handleCardClick(investimento)}
              title="Ver extrato (aportes e retiradas)"
            >
              <div className="mb-6">
                <h3 className="text-text-primary text-lg font-semibold mb-4 uppercase tracking-wide">{investimento.titulo}</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm font-normal">Valor aportado:</span>
                    <span className="text-accent-gold text-base font-semibold">{formatCurrency(aportesData[investimento.id] || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm font-normal">Vencimento:</span>
                    <span className="text-text-primary text-sm font-medium">{formatDate(investimento.data_vencimento)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pointer-events-none">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(investimento);
                  }} 
                  className="flex-1 py-2 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-200 bg-transparent text-text-muted border border-border-primary hover:bg-border-primary hover:text-text-primary pointer-events-auto"
                >
                  Editar
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
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowTrendUp, 
  faArrowTrendDown, 
  faPlus, 
  faMinus, 
  faTrash 
} from '@fortawesome/free-solid-svg-icons';
import { ExtratoProps, Movimentacao, ApiResponse } from '../types';

const Extrato: React.FC<ExtratoProps> = ({ investimento, onBack, onAddAporte, onAddRetirada }) => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totais, setTotais] = useState({
    totalAportes: 0,
    totalRetiradas: 0,
    saldoAtual: 0
  });

  useEffect(() => {
    if (investimento) {
      fetchMovimentacoes();
    }
  }, [investimento]);

  const fetchMovimentacoes = async (): Promise<void> => {
    if (!investimento) return;

    try {
      // Buscar extrato completo usando a nova rota
      const response = await fetch(`http://localhost:3001/api/investimentos/${investimento.id}/extrato`);
      const data: ApiResponse<any> = await response.json();

      if (data.success && data.data) {
        const { movimentacoes, totais } = data.data;
        
        // Converter as movimentações para o formato esperado
        const movimentacoesFormatadas: Movimentacao[] = movimentacoes.map((mov: any) => ({
          id: mov.id,
          tipo: mov.tipo,
          valor: typeof mov.valor === 'number' ? mov.valor : parseFloat(String(mov.valor)) || 0,
          data: mov.data,
          observacoes: mov.observacoes,
          investimento_id: investimento.id
        }));

        setMovimentacoes(movimentacoesFormatadas);
        setTotais({
          totalAportes: totais.totalAportes || 0,
          totalRetiradas: totais.totalRetiradas || 0,
          saldoAtual: totais.saldoAtual || 0
        });
      } else {
        console.error('Erro na resposta da API:', data.message);
        setMovimentacoes([]);
        setTotais({
          totalAportes: 0,
          totalRetiradas: 0,
          saldoAtual: 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
      setMovimentacoes([]);
      setTotais({
        totalAportes: 0,
        totalRetiradas: 0,
        saldoAtual: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movimentacao: Movimentacao): Promise<void> => {
    const tipo = movimentacao.tipo === 'aporte' ? 'aporte' : 'retirada';
    const endpoint = movimentacao.tipo === 'aporte' ? 'aportes' : 'retiradas';
    
    if (window.confirm(`Tem certeza que deseja excluir este ${tipo}?`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/${endpoint}/${movimentacao.id}`, {
          method: 'DELETE'
        });

        const data: ApiResponse = await response.json();

        if (data.success) {
          alert(data.message);
          fetchMovimentacoes();
        } else {
          alert('Erro: ' + data.message);
        }
      } catch (error) {
        console.error(`Erro ao excluir ${tipo}:`, error);
        alert(`Erro ao excluir ${tipo}`);
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
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(safeValue);
  };

  const getTipoIcon = (tipo: 'aporte' | 'retirada'): JSX.Element => {
    return tipo === 'aporte' ? 
      <FontAwesomeIcon icon={faArrowTrendUp} className="mr-2 text-base text-accent-success" /> : 
      <FontAwesomeIcon icon={faArrowTrendDown} className="mr-2 text-base text-accent-danger" />;
  };

  const getTipoClass = (tipo: 'aporte' | 'retirada'): string => {
    return tipo === 'aporte' ? 'border-l-accent-success' : 'border-l-accent-danger';
  };

  if (loading) {
    return <div className="text-center py-16 px-8 text-text-muted">Carregando extrato...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-primary">
        <button 
          onClick={onBack} 
          className="py-2 px-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white border-none rounded-lg cursor-pointer text-base transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
        >
          ← Voltar
        </button>
        <div className="flex-1 ml-8">
          <h2 className="text-white mb-4 text-2xl">{investimento?.titulo}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="text-gray-300 text-sm mb-2">Total Aportado:</div>
              <div className="text-xl font-bold text-accent-success">{formatCurrency(totais.totalAportes)}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="text-gray-300 text-sm mb-2">Total Retirado:</div>
              <div className="text-xl font-bold text-accent-danger">{formatCurrency(totais.totalRetiradas)}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="text-gray-300 text-sm mb-2">Saldo Atual:</div>
              <div className="text-xl font-bold text-accent-info">{formatCurrency(totais.saldoAtual)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8 justify-center">
        <button 
          className="py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 border-none shadow-[0_2px_4px_rgba(0,0,0,0.2)] bg-gradient-to-r from-accent-gold to-yellow-300 text-app-bg border border-accent-gold hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-200 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
          onClick={onAddAporte}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2 text-sm" /> Aportar
        </button>
        <button 
          className="py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 border-none shadow-[0_2px_4px_rgba(0,0,0,0.2)] bg-transparent text-text-secondary border-2 border-border-primary hover:bg-border-primary hover:text-text-primary hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(74,74,74,0.3)]"
          onClick={onAddRetirada}
        >
          <FontAwesomeIcon icon={faMinus} className="mr-2 text-sm" /> Retirar
        </button>
      </div>

      {movimentacoes.length === 0 ? (
        <div className="text-center text-text-muted py-12 bg-app-card rounded-xl border border-border-primary">
          <p className="mb-4 text-lg">Nenhuma movimentação encontrada para este investimento.</p>
          <p>Comece registrando um aporte!</p>
        </div>
      ) : (
        <div className="bg-app-card rounded-xl border border-border-primary p-6">
          <h3 className="text-white mb-6 text-xl">Extrato de Movimentações</h3>
          {movimentacoes.map(movimentacao => (
            <div key={`${movimentacao.tipo}-${movimentacao.id}`} className={`flex justify-between items-center p-4 mb-4 rounded-lg bg-white/5 border-l-4 transition-all duration-300 hover:bg-white/8 hover:translate-x-1 ${getTipoClass(movimentacao.tipo)}`}>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white text-base">
                    {getTipoIcon(movimentacao.tipo)} {formatDate(movimentacao.data)}
                  </span>
                </div>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(movimentacao.valor)}
                </div>
                {movimentacao.observacoes && (
                  <div className="text-gray-400 text-sm mt-2 italic">
                    {movimentacao.observacoes}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDelete(movimentacao)} 
                  className="py-1 px-2 text-sm rounded border-none cursor-pointer transition-all duration-300 bg-gradient-to-r from-red-600 to-red-700 text-white hover:bg-gradient-to-r hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5"
                  title={`Excluir ${movimentacao.tipo}`}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Extrato; 
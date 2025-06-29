import React, { useState, useEffect } from 'react';
import { ExtratoProps, Movimentacao, AporteCompleto, RetiradaCompleta, ApiResponse } from '../types';

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

  const getTipoIcon = (tipo: 'aporte' | 'retirada'): string => {
    return tipo === 'aporte' ? '↗️' : '↙️';
  };

  const getTipoClass = (tipo: 'aporte' | 'retirada'): string => {
    return tipo === 'aporte' ? 'movimentacao-aporte' : 'movimentacao-retirada';
  };

  if (loading) {
    return <div className="loading">Carregando extrato...</div>;
  }

  return (
    <div className="extrato">
      <div className="extrato-header">
        <button onClick={onBack} className="back-btn">
          ← Voltar
        </button>
        <div className="investment-summary">
          <h2>{investimento?.titulo}</h2>
          <div className="summary-stats">
            <div className="stat">
              <div className="label">Total Aportado:</div>
              <div className="value aporte-value">{formatCurrency(totais.totalAportes)}</div>
            </div>
            <div className="stat">
              <div className="label">Total Retirado:</div>
              <div className="value retirada-value">{formatCurrency(totais.totalRetiradas)}</div>
            </div>
            <div className="stat">
              <div className="label">Saldo Atual:</div>
              <div className="value saldo-value">{formatCurrency(totais.saldoAtual)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="extrato-actions">
        <button 
          className="btn btn-primary action-btn"
          onClick={onAddAporte}
        >
          ➕ Novo Aporte
        </button>
        <button 
          className="btn btn-secondary action-btn"
          onClick={onAddRetirada}
        >
          ➖ Nova Retirada
        </button>
      </div>

      {movimentacoes.length === 0 ? (
        <div className="no-movimentacoes">
          <p>Nenhuma movimentação encontrada para este investimento.</p>
          <p>Comece registrando um aporte!</p>
        </div>
      ) : (
        <div className="movimentacoes-list">
          <h3>Extrato de Movimentações</h3>
          {movimentacoes.map(movimentacao => (
            <div key={`${movimentacao.tipo}-${movimentacao.id}`} className={`movimentacao-item ${getTipoClass(movimentacao.tipo)}`}>
              <div className="movimentacao-content">
                <div className="movimentacao-header">
                  <span className="movimentacao-tipo">
                    {getTipoIcon(movimentacao.tipo)} {movimentacao.tipo === 'aporte' ? 'Aporte' : 'Retirada'}
                  </span>
                  <span className="movimentacao-data">{formatDate(movimentacao.data)}</span>
                </div>
                <div className="movimentacao-valor">
                  {formatCurrency(movimentacao.valor)}
                </div>
                {movimentacao.observacoes && (
                  <div className="movimentacao-observacoes">
                    {movimentacao.observacoes}
                  </div>
                )}
              </div>
              <div className="movimentacao-actions">
                <button 
                  onClick={() => handleDelete(movimentacao)} 
                  className="btn btn-danger btn-sm"
                  title={`Excluir ${movimentacao.tipo}`}
                >
                  🗑️
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
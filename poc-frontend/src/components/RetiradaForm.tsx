import React, { useState, useEffect } from 'react';
import { 
  RetiradaFormProps, 
  RetiradaFormData, 
  ApiResponse, 
  FormErrors,
  FormChangeEvent,
  FormSubmitEvent
} from '../types';

const RetiradaForm: React.FC<RetiradaFormProps> = ({ investimento, retirada, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<RetiradaFormData>({
    investimento_id: 0,
    valor: '',
    data_retirada: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saldoDisponivel, setSaldoDisponivel] = useState<number>(0);
  const [loadingSaldo, setLoadingSaldo] = useState<boolean>(false);

  const isEditing: boolean = !!retirada;

  useEffect(() => {
    if (investimento) {
      setFormData(prev => ({
        ...prev,
        investimento_id: investimento.id
      }));
      
      // Buscar saldo disponível
      fetchSaldoDisponivel(investimento.id);
    }

    if (retirada) {
      setFormData({
        investimento_id: retirada.investimento_id,
        valor: retirada.valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        data_retirada: (retirada.data_retirada ? 
          new Date(retirada.data_retirada).toISOString().split('T')[0] : '') as string,
        observacoes: (retirada.observacoes || '') as string
      });
    } else if (!formData.data_retirada) {
      // Se não está editando, preencher com data atual
      setFormData(prev => ({
        ...prev,
        data_retirada: new Date().toISOString().split('T')[0] as string
      }));
    }
  }, [investimento, retirada, formData.data_retirada]);

  const fetchSaldoDisponivel = async (investimentoId: number): Promise<void> => {
    setLoadingSaldo(true);
    try {
      const response = await fetch(`http://localhost:3001/api/retiradas/investimento/${investimentoId}/saldo`);
      const data: ApiResponse<any> = await response.json();
      
      if (data.success && data.data) {
        setSaldoDisponivel(data.data.saldoAtual || 0);
      } else {
        console.error('Erro na resposta da API:', data.message);
        setSaldoDisponivel(0);
      }
    } catch (error) {
      console.error('Erro ao buscar saldo disponível:', error);
      setSaldoDisponivel(0);
    } finally {
      setLoadingSaldo(false);
    }
  };

  const handleChange = (e: FormChangeEvent): void => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Aplicar máscara monetária para o campo valor
    if (name === 'valor') {
      // Remove tudo que não é dígito
      const numericValue = value.replace(/\D/g, '');
      
      if (numericValue === '' || numericValue === '0') {
        formattedValue = '';
      } else {
        // Converte para número e formata como moeda brasileira
        const numValue = parseInt(numericValue) / 100;
        formattedValue = numValue.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Limpar erros quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const valorNumerico = parseFloat(formData.valor.replace(/\D/g, '')) / 100;
    if (!formData.valor || isNaN(valorNumerico) || valorNumerico <= 0) {
      newErrors.valor = 'Valor é obrigatório e deve ser maior que zero';
    } else if (valorNumerico > saldoDisponivel) {
      newErrors.valor = `Valor excede o saldo disponível (R$ ${saldoDisponivel.toFixed(2)})`;
    }

    if (!formData.data_retirada) {
      newErrors.data_retirada = 'Data da retirada é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = isEditing 
        ? `http://localhost:3001/api/retiradas/${retirada?.id}`
        : 'http://localhost:3001/api/retiradas';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          valor: parseFloat(formData.valor.replace(/\D/g, '')) / 100 || 0
        })
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        alert(data.message);
        onSuccess();
      } else {
        alert('Erro: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao salvar retirada:', error);
      alert('Erro ao salvar retirada');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="max-w-[650px] my-8 mx-auto bg-app-card rounded-2xl p-10 border border-border-primary shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="mb-10 pb-4 border-b border-border-light">
        <h2 className="text-text-primary m-0 text-2xl font-semibold uppercase tracking-wide">{isEditing ? 'Editar Retirada' : 'Nova Retirada'}</h2>
        {investimento && (
          <p className="bg-app-input p-4 rounded-lg border-l-4 border-accent-gold mb-4 mt-4">
            <strong className="text-accent-gold text-lg block mb-2">Investimento:</strong>
            <span className="text-text-secondary text-sm">{investimento.titulo}</span>
          </p>
        )}
        {!loadingSaldo && (
          <div className="bg-accent-info/10 border border-accent-info/30 rounded-lg p-4 mb-4 mt-4 text-center">
            <strong className="text-text-secondary">Saldo disponível: </strong>
            <span className="text-accent-info text-lg font-bold">{formatCurrency(saldoDisponivel)}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col mb-6">
          <label className="mb-3 text-text-secondary font-medium text-sm">Valor (R$)*</label>
          <input
            type="text"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            className={`p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] font-mono tracking-wide bg-gradient-to-br from-app-input to-app-input-dark placeholder:text-text-placeholder placeholder:italic focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] ${errors.valor ? 'border-accent-error shadow-[0_0_0_3px_rgba(255,107,107,0.1)]' : ''}`}
            placeholder="Digite o valor (ex: R$ 1.000,00)"
          />
          {errors.valor && <span className="text-accent-error text-xs mt-1">{errors.valor}</span>}
        </div>

        <div className="flex flex-col mb-6">
          <label className="mb-3 text-text-secondary font-medium text-sm">Data da Retirada*</label>
          <input
            type="date"
            name="data_retirada"
            value={formData.data_retirada}
            onChange={handleChange}
            className={`p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] ${errors.data_retirada ? 'border-accent-error shadow-[0_0_0_3px_rgba(255,107,107,0.1)]' : ''}`}
          />
          {errors.data_retirada && <span className="text-accent-error text-xs mt-1">{errors.data_retirada}</span>}
        </div>

        <div className="flex flex-col mb-6">
          <label className="mb-3 text-text-secondary font-medium text-sm">Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={(e) => handleChange(e as FormChangeEvent)}
            rows={3}
            className="p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] resize-none"
            placeholder="Observações sobre esta retirada (opcional)"
          />
        </div>

        <div className="flex gap-6 justify-end mt-8 pt-6 border-t border-border-light">
          <button 
            type="button" 
            onClick={onCancel} 
            className="py-4 px-8 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-[0_4px_8px_rgba(0,0,0,0.2)] bg-transparent text-text-secondary border-2 border-border-primary hover:bg-border-primary hover:text-text-primary hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(74,74,74,0.3)]"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="py-4 px-8 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-[0_4px_8px_rgba(0,0,0,0.2)] bg-gradient-to-r from-accent-gold to-yellow-300 text-app-bg border border-accent-gold disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(255,215,0,0.3)]"
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Registrar Retirada')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RetiradaForm; 
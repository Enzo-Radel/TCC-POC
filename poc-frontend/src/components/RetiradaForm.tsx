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
    <div className="form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Editar Retirada' : 'Nova Retirada'}</h2>
        {investimento && (
          <p className="investimento-info">
            <strong>Investimento:</strong> {investimento.titulo}
          </p>
        )}
        {!loadingSaldo && (
          <div className="saldo-info">
            <strong>Saldo disponível: </strong>
            <span className="saldo-value">{formatCurrency(saldoDisponivel)}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="aporte-form">
        <div className="form-group">
          <label>Valor (R$)*</label>
          <input
            type="text"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            className={errors.valor ? 'error' : ''}
            placeholder="Digite o valor (ex: R$ 1.000,00)"
          />
          {errors.valor && <span className="error-message">{errors.valor}</span>}
        </div>

        <div className="form-group">
          <label>Data da Retirada*</label>
          <input
            type="date"
            name="data_retirada"
            value={formData.data_retirada}
            onChange={handleChange}
            className={errors.data_retirada ? 'error' : ''}
          />
          {errors.data_retirada && <span className="error-message">{errors.data_retirada}</span>}
        </div>

        <div className="form-group">
          <label>Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={(e) => handleChange(e as FormChangeEvent)}
            rows={3}
            placeholder="Observações sobre esta retirada (opcional)"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Registrar Retirada')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RetiradaForm; 
import React, { useState, useEffect } from 'react';
import { 
  AporteFormProps, 
  AporteFormData, 
  ApiResponse, 
  FormErrors,
  FormChangeEvent,
  FormSubmitEvent
} from '../types';

const AporteForm: React.FC<AporteFormProps> = ({ investimento, aporte, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<AporteFormData>({
    investimento_id: 0,
    valor: '',
    data_aporte: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing: boolean = !!aporte;

  useEffect(() => {
    if (investimento) {
      setFormData(prev => ({
        ...prev,
        investimento_id: investimento.id
      }));
    }

    if (aporte) {
      setFormData({
        investimento_id: aporte.investimento_id,
        valor: aporte.valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        data_aporte: (aporte.data_aporte ? 
          new Date(aporte.data_aporte).toISOString().split('T')[0] : '') as string,
        observacoes: (aporte.observacoes || '') as string
      });
    } else if (!formData.data_aporte) {
      // Se não está editando, preencher com data atual
      setFormData(prev => ({
        ...prev,
        data_aporte: new Date().toISOString().split('T')[0] as string
      }));
    }
  }, [investimento, aporte, formData.data_aporte]);

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
    }

    if (!formData.data_aporte) {
      newErrors.data_aporte = 'Data do aporte é obrigatória';
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
        ? `http://localhost:3001/api/aportes/${aporte?.id}`
        : 'http://localhost:3001/api/aportes';
      
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
      console.error('Erro ao salvar aporte:', error);
      alert('Erro ao salvar aporte');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-[650px] my-8 mx-auto bg-app-card rounded-2xl p-10 border border-border-primary shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="mb-10 pb-4 border-b border-border-light">
        <h2 className="text-text-primary m-0 text-2xl font-semibold uppercase tracking-wide">{isEditing ? 'Editar Aporte' : 'Novo Aporte'}</h2>
        {investimento && (
          <p className="bg-app-input p-4 rounded-lg border-l-4 border-accent-gold mb-4 mt-4">
            <strong className="text-accent-gold text-lg block mb-2">Investimento:</strong>
            <span className="text-text-secondary text-sm">{investimento.titulo}</span>
          </p>
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
          <label className="mb-3 text-text-secondary font-medium text-sm">Data do Aporte*</label>
          <input
            type="date"
            name="data_aporte"
            value={formData.data_aporte}
            onChange={handleChange}
            className={`p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] ${errors.data_aporte ? 'border-accent-error shadow-[0_0_0_3px_rgba(255,107,107,0.1)]' : ''}`}
          />
          {errors.data_aporte && <span className="text-accent-error text-xs mt-1">{errors.data_aporte}</span>}
        </div>

        <div className="flex flex-col mb-6">
          <label className="mb-3 text-text-secondary font-medium text-sm">Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={(e) => handleChange(e as FormChangeEvent)}
            rows={3}
            className="p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] resize-none"
            placeholder="Observações sobre este aporte (opcional)"
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
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Registrar Aporte')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AporteForm; 
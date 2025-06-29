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
        valor: aporte.valor.toString(),
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
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erros quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
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
          valor: parseFloat(formData.valor)
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
    <div className="form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Editar Aporte' : 'Novo Aporte'}</h2>
        {investimento && (
          <p className="investimento-info">
            <strong>Investimento:</strong> {investimento.titulo}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="aporte-form">
        <div className="form-group">
          <label>Valor (R$)*</label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={errors.valor ? 'error' : ''}
            placeholder="Ex: 1000.00"
          />
          {errors.valor && <span className="error-message">{errors.valor}</span>}
        </div>

        <div className="form-group">
          <label>Data do Aporte*</label>
          <input
            type="date"
            name="data_aporte"
            value={formData.data_aporte}
            onChange={handleChange}
            className={errors.data_aporte ? 'error' : ''}
          />
          {errors.data_aporte && <span className="error-message">{errors.data_aporte}</span>}
        </div>

        <div className="form-group">
          <label>Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={(e) => handleChange(e as FormChangeEvent)}
            rows={3}
            placeholder="Observações sobre este aporte (opcional)"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Registrar Aporte')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AporteForm; 
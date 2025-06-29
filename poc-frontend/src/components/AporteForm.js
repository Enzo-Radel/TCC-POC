import React, { useState } from 'react';

const AporteForm = ({ investimento, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    valor: '',
    data_aporte: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erros quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }

    if (!formData.data_aporte) {
      newErrors.data_aporte = 'Data do aporte é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/aportes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          investimento_id: investimento.id
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        onSuccess();
      } else {
        alert('Erro: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao registrar aporte:', error);
      alert('Erro ao registrar aporte');
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

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Registrar Aporte</h2>
        <div className="investment-info">
          <h3>{investimento.titulo}</h3>
          <p>Categoria: {investimento.categoria_nome}</p>
          <p>Total já aportado: {formatCurrency(investimento.total_aportado || 0)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="aporte-form">
        <div className="form-group">
          <label>Valor do Aporte (R$)*</label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="0,00"
            className={errors.valor ? 'error' : ''}
          />
          {errors.valor && <span className="error-message">{errors.valor}</span>}
          {formData.valor && parseFloat(formData.valor) > 0 && (
            <span className="helper-text">
              Valor: {formatCurrency(parseFloat(formData.valor))}
            </span>
          )}
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

        <div className="aporte-summary">
          <h4>Resumo</h4>
          <div className="summary-item">
            <span>Investimento:</span>
            <span>{investimento.titulo}</span>
          </div>
          <div className="summary-item">
            <span>Total atual:</span>
            <span>{formatCurrency(investimento.total_aportado || 0)}</span>
          </div>
          <div className="summary-item">
            <span>Novo aporte:</span>
            <span>{formData.valor ? formatCurrency(parseFloat(formData.valor)) : 'R$ 0,00'}</span>
          </div>
          <div className="summary-item total">
            <span>Total após aporte:</span>
            <span>
              {formatCurrency(
                (parseFloat(investimento.total_aportado) || 0) + 
                (parseFloat(formData.valor) || 0)
              )}
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Registrando...' : 'Registrar Aporte'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AporteForm; 
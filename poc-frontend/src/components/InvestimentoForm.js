import React, { useState, useEffect } from 'react';

const InvestimentoForm = ({ investimento, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    data_vencimento: '',
    tipo_taxa_juros: 'porcentagem',
    rentabilidade: '',
    indices: '',
    porcentagem_do_indice: '',
    categoria_id: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!investimento;

  useEffect(() => {
    fetchCategorias();
    
    if (investimento) {
      setFormData({
        titulo: investimento.titulo || '',
        data_vencimento: investimento.data_vencimento ? 
          new Date(investimento.data_vencimento).toISOString().split('T')[0] : '',
        tipo_taxa_juros: investimento.tipo_taxa_juros || 'porcentagem',
        rentabilidade: investimento.rentabilidade || '',
        indices: investimento.indices || '',
        porcentagem_do_indice: investimento.porcentagem_do_indice || '',
        categoria_id: investimento.categoria_id || ''
      });
    }
  }, [investimento]);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categorias');
      const data = await response.json();
      
      if (data.success) {
        setCategorias(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

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

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.data_vencimento) {
      newErrors.data_vencimento = 'Data de vencimento é obrigatória';
    }

    if (!formData.categoria_id) {
      newErrors.categoria_id = 'Categoria é obrigatória';
    }

    // Validações específicas por tipo de taxa
    if (formData.tipo_taxa_juros === 'porcentagem' || formData.tipo_taxa_juros === 'mista') {
      if (!formData.rentabilidade || parseFloat(formData.rentabilidade) <= 0) {
        newErrors.rentabilidade = 'Rentabilidade é obrigatória e deve ser maior que zero';
      }
    }

    if (formData.tipo_taxa_juros === 'indice' || formData.tipo_taxa_juros === 'mista') {
      if (!formData.indices) {
        newErrors.indices = 'Índice é obrigatório';
      }
      if (!formData.porcentagem_do_indice || parseFloat(formData.porcentagem_do_indice) <= 0) {
        newErrors.porcentagem_do_indice = 'Porcentagem do índice é obrigatória e deve ser maior que zero';
      }
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
      const url = isEditing 
        ? `http://localhost:3001/api/investimentos/${investimento.id}`
        : 'http://localhost:3001/api/investimentos';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        onSuccess();
      } else {
        alert('Erro: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao salvar investimento:', error);
      alert('Erro ao salvar investimento');
    } finally {
      setLoading(false);
    }
  };

  const renderTaxaFields = () => {
    const { tipo_taxa_juros } = formData;

    return (
      <div className="taxa-fields">
        {/* Rentabilidade (para porcentagem e mista) */}
        {(tipo_taxa_juros === 'porcentagem' || tipo_taxa_juros === 'mista') && (
          <div className="form-group">
            <label>Rentabilidade (%)*</label>
            <input
              type="number"
              name="rentabilidade"
              value={formData.rentabilidade}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={errors.rentabilidade ? 'error' : ''}
            />
            {errors.rentabilidade && <span className="error-message">{errors.rentabilidade}</span>}
          </div>
        )}

        {/* Índice (para índice e mista) */}
        {(tipo_taxa_juros === 'indice' || tipo_taxa_juros === 'mista') && (
          <>
            <div className="form-group">
              <label>Índice*</label>
              <select
                name="indices"
                value={formData.indices}
                onChange={handleChange}
                className={errors.indices ? 'error' : ''}
              >
                <option value="">Selecione um índice</option>
                <option value="CDI">CDI</option>
                <option value="IPCA">IPCA</option>
                <option value="SELIC">SELIC</option>
                <option value="IGPM">IGPM</option>
                <option value="TJLP">TJLP</option>
              </select>
              {errors.indices && <span className="error-message">{errors.indices}</span>}
            </div>

            <div className="form-group">
              <label>Porcentagem do Índice (%)*</label>
              <input
                type="number"
                name="porcentagem_do_indice"
                value={formData.porcentagem_do_indice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={errors.porcentagem_do_indice ? 'error' : ''}
              />
              {errors.porcentagem_do_indice && <span className="error-message">{errors.porcentagem_do_indice}</span>}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Editar Investimento' : 'Novo Investimento'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="investment-form">
        <div className="form-group">
          <label>Título*</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={errors.titulo ? 'error' : ''}
          />
          {errors.titulo && <span className="error-message">{errors.titulo}</span>}
        </div>

        <div className="form-group">
          <label>Data de Vencimento*</label>
          <input
            type="date"
            name="data_vencimento"
            value={formData.data_vencimento}
            onChange={handleChange}
            className={errors.data_vencimento ? 'error' : ''}
          />
          {errors.data_vencimento && <span className="error-message">{errors.data_vencimento}</span>}
        </div>

        <div className="form-group">
          <label>Tipo de Taxa de Juros*</label>
          <select
            name="tipo_taxa_juros"
            value={formData.tipo_taxa_juros}
            onChange={handleChange}
          >
            <option value="porcentagem">Porcentagem</option>
            <option value="indice">Índice</option>
            <option value="mista">Mista</option>
          </select>
        </div>

        {renderTaxaFields()}

        <div className="form-group">
          <label>Categoria*</label>
          <select
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
            className={errors.categoria_id ? 'error' : ''}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          {errors.categoria_id && <span className="error-message">{errors.categoria_id}</span>}
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
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestimentoForm; 
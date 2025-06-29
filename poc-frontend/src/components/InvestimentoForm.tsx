import React, { useState, useEffect } from 'react';
import { 
  InvestimentoFormProps, 
  InvestimentoFormData, 
  Categoria, 
  ApiResponse, 
  FormErrors,
  FormChangeEvent,
  FormSubmitEvent
} from '../types';

const InvestimentoForm: React.FC<InvestimentoFormProps> = ({ investimento, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<InvestimentoFormData>({
    titulo: '',
    data_vencimento: '',
    tipo_taxa_juros: 'porcentagem',
    rentabilidade: '',
    indices: '',
    porcentagem_do_indice: '',
    categoria_id: ''
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing: boolean = !!investimento;

  useEffect(() => {
    fetchCategorias();
    
    if (investimento) {
      setFormData({
        titulo: (investimento.titulo || '') as string,
        data_vencimento: (investimento.data_vencimento ? 
          new Date(investimento.data_vencimento).toISOString().split('T')[0] : '') as string,
        tipo_taxa_juros: (investimento.tipo_taxa_juros || 'porcentagem') as 'porcentagem' | 'indice' | 'mista',
        rentabilidade: (investimento.rentabilidade?.toString() || '') as string,
        indices: (investimento.indices || '') as string,
        porcentagem_do_indice: (investimento.porcentagem_do_indice?.toString() || '') as string,
        categoria_id: (investimento.categoria_id?.toString() || '') as string
      });
    }
  }, [investimento]);

  const fetchCategorias = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3001/api/categorias');
      const data: ApiResponse<Categoria[]> = await response.json();
      
      if (data.success && data.data) {
        setCategorias(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleChange = (e: FormChangeEvent): void => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Aplicar máscaras específicas
    if (name === 'rentabilidade' || name === 'porcentagem_do_indice') {
      // Máscara para percentual - permite apenas números e vírgula/ponto
      formattedValue = value
        .replace(/[^\d.,]/g, '') // Remove tudo que não é dígito, vírgula ou ponto
        .replace(',', '.') // Converte vírgula em ponto
        .replace(/\.{2,}/g, '.') // Remove pontos duplicados
        .replace(/(\.\d{2})\d+/g, '$1'); // Limita a 2 casas decimais
      
      // Não permite valores negativos (remove sinal negativo se existir)
      formattedValue = formattedValue.replace(/-/g, '');
      
      // Impede que comece com ponto
      if (formattedValue.startsWith('.')) {
        formattedValue = formattedValue.substring(1);
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

  const handleSubmit = async (e: FormSubmitEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = isEditing 
        ? `http://localhost:3001/api/investimentos/${investimento?.id}`
        : 'http://localhost:3001/api/investimentos';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          rentabilidade: formData.rentabilidade ? parseFloat(formData.rentabilidade) : undefined,
          porcentagem_do_indice: formData.porcentagem_do_indice ? parseFloat(formData.porcentagem_do_indice) : undefined,
          categoria_id: parseInt(formData.categoria_id, 10)
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
      console.error('Erro ao salvar investimento:', error);
      alert('Erro ao salvar investimento');
    } finally {
      setLoading(false);
    }
  };

  const renderTaxaFields = (): JSX.Element => {
    const { tipo_taxa_juros } = formData;

    return (
      <div className="taxa-fields">
        {/* Rentabilidade (para porcentagem e mista) */}
        {(tipo_taxa_juros === 'porcentagem' || tipo_taxa_juros === 'mista') && (
          <div className="form-group">
            <label>Rentabilidade (%)*</label>
            <input
              type="text"
              name="rentabilidade"
              value={formData.rentabilidade}
              onChange={handleChange}
              className={errors.rentabilidade ? 'error' : ''}
              placeholder="Ex: 12,75"
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
                type="text"
                name="porcentagem_do_indice"
                value={formData.porcentagem_do_indice}
                onChange={handleChange}
                className={errors.porcentagem_do_indice ? 'error' : ''}
                placeholder="Ex: 100"
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

      <form onSubmit={handleSubmit} className="investimento-form">
        <div className="form-group">
          <label>Título*</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={errors.titulo ? 'error' : ''}
            placeholder="Ex: CDB XYZ Bank"
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

        <div className="form-group">
          <label>Tipo de Taxa de Juros*</label>
          <select
            name="tipo_taxa_juros"
            value={formData.tipo_taxa_juros}
            onChange={handleChange}
          >
            <option value="porcentagem">Porcentagem Fixa</option>
            <option value="indice">Vinculado a Índice</option>
            <option value="mista">Mista (Porcentagem + Índice)</option>
          </select>
        </div>

        {renderTaxaFields()}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestimentoForm; 
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
      <div className="bg-app-input p-6 rounded-xl border border-border-primary shadow-[0_2px_8px_rgba(0,0,0,0.2)] mt-2">
        {/* Rentabilidade (para porcentagem e mista) */}
        {(tipo_taxa_juros === 'porcentagem' || tipo_taxa_juros === 'mista') && (
          <div className="flex flex-col mb-6">
            <label className="mb-3 text-text-secondary font-medium text-sm">Rentabilidade (%)*</label>
            <input
              type="text"
              name="rentabilidade"
              value={formData.rentabilidade}
              onChange={handleChange}
              className={`p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] font-mono tracking-wide bg-gradient-to-br from-app-input to-app-input-dark placeholder:text-text-placeholder placeholder:italic focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] ${errors.rentabilidade ? 'border-accent-error shadow-[0_0_0_3px_rgba(255,107,107,0.1)]' : ''}`}
              placeholder="Ex: 12,75"
            />
            {errors.rentabilidade && <span className="text-accent-error text-xs mt-1">{errors.rentabilidade}</span>}
          </div>
        )}

        {/* Índice (para índice e mista) */}
        {(tipo_taxa_juros === 'indice' || tipo_taxa_juros === 'mista') && (
          <>
            <div className="flex flex-col mb-6">
              <label className="mb-3 text-text-secondary font-medium text-sm">Índice*</label>
              <select
                name="indices"
                value={formData.indices}
                onChange={handleChange}
                className={`p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] ${errors.indices ? 'border-accent-error shadow-[0_0_0_3px_rgba(255,107,107,0.1)]' : ''}`}
              >
                <option value="">Selecione um índice</option>
                <option value="CDI">CDI</option>
                <option value="IPCA">IPCA</option>
                <option value="SELIC">SELIC</option>
                <option value="IGPM">IGPM</option>
                <option value="TJLP">TJLP</option>
              </select>
              {errors.indices && <span className="text-accent-error text-xs mt-1">{errors.indices}</span>}
            </div>

            <div className="flex flex-col mb-6">
              <label className="mb-3 text-text-secondary font-medium text-sm">Porcentagem do Índice (%)*</label>
              <input
                type="text"
                name="porcentagem_do_indice"
                value={formData.porcentagem_do_indice}
                onChange={handleChange}
                className={`p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] font-mono tracking-wide bg-gradient-to-br from-app-input to-app-input-dark placeholder:text-text-placeholder placeholder:italic focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] ${errors.porcentagem_do_indice ? 'border-accent-error shadow-[0_0_0_3px_rgba(255,107,107,0.1)]' : ''}`}
                placeholder="Ex: 100"
              />
              {errors.porcentagem_do_indice && <span className="text-accent-error text-xs mt-1">{errors.porcentagem_do_indice}</span>}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[650px] my-8 mx-auto bg-app-card rounded-2xl p-10 border border-border-primary shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="mb-10 pb-4 border-b border-border-light">
        <h2 className="text-text-primary m-0 text-2xl font-semibold uppercase tracking-wide">{isEditing ? 'Editar Investimento' : 'Novo Investimento'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col mb-6">
          <label className="mb-3 text-text-secondary font-medium text-sm">Título*</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={`p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] ${errors.titulo ? 'border-accent-error shadow-[0_0_0_3px_rgba(255,107,107,0.1)]' : ''}`}
            placeholder="Ex: CDB XYZ Bank"
          />
          {errors.titulo && <span className="text-accent-error text-xs mt-1">{errors.titulo}</span>}
        </div>

        <div className="flex flex-col mb-6">
          <label className="mb-3 text-text-secondary font-medium text-sm">Data de Vencimento*</label>
          <input
            type="date"
            name="data_vencimento"
            value={formData.data_vencimento}
            onChange={handleChange}
            className={`p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] ${errors.data_vencimento ? 'border-accent-error shadow-[0_0_0_3px_rgba(255,107,107,0.1)]' : ''}`}
          />
          {errors.data_vencimento && <span className="text-accent-error text-xs mt-1">{errors.data_vencimento}</span>}
        </div>

        <div className="flex flex-col mb-6">
          <label className="mb-3 text-text-secondary font-medium text-sm">Categoria*</label>
          <select
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
            className={`p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)] ${errors.categoria_id ? 'border-accent-error shadow-[0_0_0_3px_rgba(255,107,107,0.1)]' : ''}`}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          {errors.categoria_id && <span className="text-accent-error text-xs mt-1">{errors.categoria_id}</span>}
        </div>

        <div className="flex flex-col mb-6">
          <label className="mb-3 text-text-secondary font-medium text-sm">Tipo de Taxa de Juros*</label>
          <select
            name="tipo_taxa_juros"
            value={formData.tipo_taxa_juros}
            onChange={handleChange}
            className="p-4 border border-border-primary rounded-xl text-sm bg-app-input text-text-primary transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.1)]"
          >
            <option value="porcentagem">Porcentagem Fixa</option>
            <option value="indice">Vinculado a Índice</option>
            <option value="mista">Mista (Porcentagem + Índice)</option>
          </select>
        </div>

        {renderTaxaFields()}

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
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestimentoForm; 
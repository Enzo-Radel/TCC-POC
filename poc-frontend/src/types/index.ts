// Tipos base das entidades
export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Investimento {
  id: number;
  titulo: string;
  data_vencimento: string;
  tipo_taxa_juros: 'porcentagem' | 'indice' | 'mista';
  rentabilidade?: number;
  indices?: string;
  porcentagem_do_indice?: number;
  categoria_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface InvestimentoCompleto extends Investimento {
  categoria_nome: string;
  categoria_descricao?: string;
}

export interface Aporte {
  id: number;
  investimento_id: number;
  valor: number;
  data_aporte: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AporteCompleto extends Aporte {
  investimento_titulo: string;
  investimento_categoria?: string;
}

// DTOs para formulários
export interface InvestimentoFormData {
  titulo: string;
  data_vencimento: string;
  tipo_taxa_juros: 'porcentagem' | 'indice' | 'mista';
  rentabilidade: string;
  indices: string;
  porcentagem_do_indice: string;
  categoria_id: string;
}

export interface AporteFormData {
  investimento_id: number;
  valor: string;
  data_aporte: string;
  observacoes?: string;
}

export interface CategoriaFormData {
  nome: string;
  descricao?: string;
}

// Tipos para respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Tipos para propriedades dos componentes
export interface InvestimentoFormProps {
  investimento?: InvestimentoCompleto;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface InvestimentosListProps {
  onEdit: (investimento: InvestimentoCompleto) => void;
  onAddAporte: (investimento: InvestimentoCompleto) => void;
  onAddNew: () => void;
  onViewAportes?: (investimento: InvestimentoCompleto) => void;
}

export interface AporteFormProps {
  investimento?: InvestimentoCompleto;
  aporte?: AporteCompleto;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface AportesListProps {
  investimento?: InvestimentoCompleto;
  onBack?: () => void;
}

// Tipos para validação de formulários
export interface FormErrors {
  [key: string]: string;
}

// Tipos para eventos de formulário
export interface FormChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {}
export interface FormSubmitEvent extends React.FormEvent<HTMLFormElement> {}

// Tipos de visualização da aplicação
export type ViewType = 
  | 'investimentos' 
  | 'add-investimento' 
  | 'edit-investimento' 
  | 'add-aporte' 
  | 'view-aportes';

// Tipo para opções de select
export interface SelectOption {
  value: string | number;
  label: string;
} 
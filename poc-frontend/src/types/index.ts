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

export interface Retirada {
  id: number;
  investimento_id: number;
  valor: number;
  data_retirada: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RetiradaCompleta extends Retirada {
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

export interface RetiradaFormData {
  investimento_id: number;
  valor: string;
  data_retirada: string;
  observacoes?: string;
}

// Tipo para movimentações do extrato (aportes + retiradas)
export interface Movimentacao {
  id: number;
  tipo: 'aporte' | 'retirada';
  valor: number;
  data: string;
  observacoes?: string;
  investimento_id: number;
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
  onAddNew: () => void;
  onViewExtrato?: (investimento: InvestimentoCompleto) => void;
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

export interface RetiradaFormProps {
  investimento?: InvestimentoCompleto;
  retirada?: RetiradaCompleta;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface ExtratoProps {
  investimento?: InvestimentoCompleto;
  onBack?: () => void;
  onAddAporte?: () => void;
  onAddRetirada?: () => void;
}

export interface MovimentacoesListProps {
  movimentacoes: Movimentacao[];
  onEdit?: (movimentacao: Movimentacao) => void;
  onDelete?: (movimentacao: Movimentacao) => void;
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
  | 'add-retirada'
  | 'edit-aporte'
  | 'edit-retirada'
  | 'extrato';

// Tipo para opções de select
export interface SelectOption {
  value: string | number;
  label: string;
} 
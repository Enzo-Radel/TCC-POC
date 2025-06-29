import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Tipos para banco de dados
export interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

// Interface para Categoria
export interface Categoria extends RowDataPacket {
  id: number;
  nome: string;
  descricao?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface para Investimento
export interface Investimento extends RowDataPacket {
  id: number;
  titulo: string;
  data_vencimento: Date;
  tipo_taxa_juros: 'porcentagem' | 'indice' | 'mista';
  rentabilidade?: number;
  indices?: string;
  porcentagem_do_indice?: number;
  categoria_id: number;
  created_at: Date;
  updated_at: Date;
}

// Interface para Investimento com dados da categoria (join)
export interface InvestimentoCompleto extends Investimento {
  categoria_nome: string;
  categoria_descricao?: string;
}

// Interface para Aporte
export interface Aporte extends RowDataPacket {
  id: number;
  investimento_id: number;
  valor: number;
  data_aporte: Date;
  observacoes?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface para Aporte com dados do investimento (join)
export interface AporteCompleto extends Aporte {
  investimento_titulo: string;
  investimento_categoria: string;
}

// Interface para Retirada
export interface Retirada extends RowDataPacket {
  id: number;
  investimento_id: number;
  valor: number;
  data_retirada: Date;
  observacoes?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface para Retirada com dados do investimento (join)
export interface RetiradaCompleta extends Retirada {
  investimento_titulo: string;
  investimento_categoria: string;
}

// DTOs para criação/atualização
export interface CreateCategoriaDto {
  nome: string;
  descricao?: string;
}

export interface UpdateCategoriaDto {
  nome?: string;
  descricao?: string;
}

export interface CreateInvestimentoDto {
  titulo: string;
  data_vencimento: string | Date;
  tipo_taxa_juros: 'porcentagem' | 'indice' | 'mista';
  rentabilidade?: number;
  indices?: string;
  porcentagem_do_indice?: number;
  categoria_id: number;
}

export interface UpdateInvestimentoDto {
  titulo?: string;
  data_vencimento?: string | Date;
  tipo_taxa_juros?: 'porcentagem' | 'indice' | 'mista';
  rentabilidade?: number;
  indices?: string;
  porcentagem_do_indice?: number;
  categoria_id?: number;
}

export interface CreateAporteDto {
  investimento_id: number;
  valor: number;
  data_aporte: string | Date;
  observacoes?: string;
}

export interface UpdateAporteDto {
  valor?: number;
  data_aporte?: string | Date;
  observacoes?: string;
}

export interface CreateRetiradaDto {
  investimento_id: number;
  valor: number;
  data_retirada: string | Date;
  observacoes?: string;
}

export interface UpdateRetiradaDto {
  valor?: number;
  data_retirada?: string | Date;
  observacoes?: string;
}

// Tipos para respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Tipos para resultados do MySQL
export interface DatabaseResult extends ResultSetHeader {
  insertId: number;
  affectedRows: number;
}

// Tipos para parâmetros de rotas
export interface RouteParams {
  id: string;
  [key: string]: string;
}

// Tipos para query parameters
export interface QueryParams {
  page?: string;
  limit?: string;
  categoria_id?: string;
  search?: string;
  [key: string]: string | string[] | undefined;
} 
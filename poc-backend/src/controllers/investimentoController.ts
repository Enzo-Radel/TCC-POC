import { Request, Response } from 'express';
import { InvestimentoModel } from '../models/Investimento';
import { 
  ApiResponse, 
  InvestimentoCompleto, 
  CreateInvestimentoDto, 
  UpdateInvestimentoDto,
  RouteParams,
  QueryParams
} from '../types';

export class InvestimentoController {
  // GET /api/investimentos
  static async index(req: Request, res: Response<ApiResponse<InvestimentoCompleto[]>>): Promise<void> {
    try {
      const { categoria_id } = req.query;
      
      let investimentos: InvestimentoCompleto[];
      if (categoria_id && typeof categoria_id === 'string') {
        investimentos = await InvestimentoModel.findByCategoria(parseInt(categoria_id, 10));
      } else {
        investimentos = await InvestimentoModel.findAll();
      }

      res.json({
        success: true,
        message: 'Investimentos encontrados',
        data: investimentos
      });
    } catch (error) {
      console.error('Erro ao buscar investimentos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // GET /api/investimentos/:id
  static async show(req: Request<RouteParams>, res: Response<ApiResponse<InvestimentoCompleto>>): Promise<void> {
    try {
      const { id } = req.params;
      const investimento = await InvestimentoModel.findById(parseInt(id, 10));
      
      if (!investimento) {
        res.status(404).json({
          success: false,
          message: 'Investimento não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Investimento encontrado',
        data: investimento
      });
    } catch (error) {
      console.error('Erro ao buscar investimento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // POST /api/investimentos
  static async store(req: Request<{}, ApiResponse, CreateInvestimentoDto>, res: Response<ApiResponse>): Promise<void> {
    try {
      const {
        titulo,
        data_vencimento,
        tipo_taxa_juros,
        rentabilidade,
        indices,
        porcentagem_do_indice,
        categoria_id
      } = req.body;

      // Validações básicas
      if (!titulo || !data_vencimento || !categoria_id) {
        res.status(400).json({
          success: false,
          message: 'Título, data de vencimento e categoria são obrigatórios'
        });
        return;
      }

      // Validações específicas por tipo de taxa
      if (tipo_taxa_juros === 'porcentagem' || tipo_taxa_juros === 'mista') {
        if (!rentabilidade || rentabilidade <= 0) {
          res.status(400).json({
            success: false,
            message: 'Rentabilidade é obrigatória para taxa de juros de porcentagem ou mista'
          });
          return;
        }
      }

      if (tipo_taxa_juros === 'indice' || tipo_taxa_juros === 'mista') {
        if (!indices || !porcentagem_do_indice) {
          res.status(400).json({
            success: false,
            message: 'Índice e porcentagem do índice são obrigatórios para taxa de juros de índice ou mista'
          });
          return;
        }
      }

      const investimento = await InvestimentoModel.create({
        titulo,
        data_vencimento,
        tipo_taxa_juros: tipo_taxa_juros || 'porcentagem',
        rentabilidade,
        indices,
        porcentagem_do_indice,
        categoria_id
      });
      
      res.status(201).json({
        success: true,
        message: 'Investimento criado com sucesso',
        data: investimento
      });
    } catch (error) {
      console.error('Erro ao criar investimento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // PUT /api/investimentos/:id
  static async update(req: Request<RouteParams, ApiResponse, UpdateInvestimentoDto>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const {
        titulo,
        data_vencimento,
        tipo_taxa_juros,
        rentabilidade,
        indices,
        porcentagem_do_indice,
        categoria_id
      } = req.body;

      // Validações básicas
      if (!titulo || !data_vencimento || !categoria_id) {
        res.status(400).json({
          success: false,
          message: 'Título, data de vencimento e categoria são obrigatórios'
        });
        return;
      }

      // Validações específicas por tipo de taxa
      if (tipo_taxa_juros === 'porcentagem' || tipo_taxa_juros === 'mista') {
        if (!rentabilidade || rentabilidade <= 0) {
          res.status(400).json({
            success: false,
            message: 'Rentabilidade é obrigatória para taxa de juros de porcentagem ou mista'
          });
          return;
        }
      }

      if (tipo_taxa_juros === 'indice' || tipo_taxa_juros === 'mista') {
        if (!indices || !porcentagem_do_indice) {
          res.status(400).json({
            success: false,
            message: 'Índice e porcentagem do índice são obrigatórios para taxa de juros de índice ou mista'
          });
          return;
        }
      }

      const updated = await InvestimentoModel.update(parseInt(id, 10), {
        titulo,
        data_vencimento,
        tipo_taxa_juros,
        rentabilidade,
        indices,
        porcentagem_do_indice,
        categoria_id
      });
      
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Investimento não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Investimento atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar investimento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // DELETE /api/investimentos/:id
  static async destroy(req: Request<RouteParams>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await InvestimentoModel.delete(parseInt(id, 10));
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Investimento não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Investimento deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar investimento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
} 
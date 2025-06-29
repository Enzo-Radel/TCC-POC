import { Request, Response } from 'express';
import { AporteModel } from '../models/Aporte';
import { 
  ApiResponse, 
  Aporte,
  AporteCompleto, 
  CreateAporteDto, 
  UpdateAporteDto,
  RouteParams
} from '../types';

export class AporteController {
  // GET /api/aportes
  static async index(req: Request, res: Response<ApiResponse<AporteCompleto[]>>): Promise<void> {
    try {
      const { investimento_id } = req.query;
      
      let aportes: AporteCompleto[];
      if (investimento_id && typeof investimento_id === 'string') {
        aportes = await AporteModel.findByInvestimento(parseInt(investimento_id, 10));
      } else {
        aportes = await AporteModel.findAll();
      }

      res.json({
        success: true,
        message: 'Aportes encontrados',
        data: aportes
      });
    } catch (error) {
      console.error('Erro ao buscar aportes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // GET /api/aportes/:id
  static async show(req: Request<RouteParams>, res: Response<ApiResponse<AporteCompleto>>): Promise<void> {
    try {
      const { id } = req.params;
      const aporte = await AporteModel.findById(parseInt(id, 10));
      
      if (!aporte) {
        res.status(404).json({
          success: false,
          message: 'Aporte não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Aporte encontrado',
        data: aporte
      });
    } catch (error) {
      console.error('Erro ao buscar aporte:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // POST /api/aportes
  static async store(req: Request<{}, ApiResponse, CreateAporteDto>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { investimento_id, valor, data_aporte, observacoes } = req.body;

      // Validações básicas
      if (!investimento_id || !valor) {
        res.status(400).json({
          success: false,
          message: 'Investimento e valor são obrigatórios'
        });
        return;
      }

      if (valor <= 0) {
        res.status(400).json({
          success: false,
          message: 'Valor deve ser maior que zero'
        });
        return;
      }

      const aporte = await AporteModel.create({
        investimento_id,
        valor,
        data_aporte: data_aporte ?? new Date().toISOString().split('T')[0],
        observacoes
      });
      
      res.status(201).json({
        success: true,
        message: 'Aporte registrado com sucesso',
        data: aporte
      });
    } catch (error) {
      console.error('Erro ao criar aporte:', error);
      
      if (error instanceof Error && 'code' in error && error.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({
          success: false,
          message: 'Investimento não encontrado'
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // PUT /api/aportes/:id
  static async update(req: Request<RouteParams, ApiResponse, UpdateAporteDto>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const { valor, data_aporte, observacoes } = req.body;

      // Validações básicas
      if (!valor || !data_aporte) {
        res.status(400).json({
          success: false,
          message: 'Valor e data do aporte são obrigatórios'
        });
        return;
      }

      if (valor <= 0) {
        res.status(400).json({
          success: false,
          message: 'Valor deve ser maior que zero'
        });
        return;
      }

      const updated = await AporteModel.update(parseInt(id, 10), {
        valor,
        data_aporte,
        observacoes
      });
      
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Aporte não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Aporte atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar aporte:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // DELETE /api/aportes/:id
  static async destroy(req: Request<RouteParams>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await AporteModel.delete(parseInt(id, 10));
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Aporte não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Aporte removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover aporte:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // GET /api/aportes/total/:investimento_id
  static async getTotalByInvestimento(req: Request<{ investimento_id: string }>, res: Response<ApiResponse<{ total: number }>>): Promise<void> {
    try {
      const { investimento_id } = req.params;
      const total = await AporteModel.getTotalByInvestimento(parseInt(investimento_id, 10));

      res.json({
        success: true,
        message: 'Total calculado',
        data: { total }
      });
    } catch (error) {
      console.error('Erro ao buscar total de aportes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
} 
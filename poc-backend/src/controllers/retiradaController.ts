import { Request, Response } from 'express';
import { RetiradaModel } from '../models/Retirada';
import { AporteModel } from '../models/Aporte';
import { InvestimentoModel } from '../models/Investimento';
import { 
  ApiResponse, 
  RetiradaCompleta, 
  CreateRetiradaDto, 
  UpdateRetiradaDto,
  RouteParams,
  QueryParams
} from '../types';

export class RetiradaController {
  // GET /api/retiradas
  static async index(req: Request, res: Response<ApiResponse<RetiradaCompleta[]>>): Promise<void> {
    try {
      const { investimento_id } = req.query;
      
      let retiradas: RetiradaCompleta[];
      if (investimento_id && typeof investimento_id === 'string') {
        retiradas = await RetiradaModel.findByInvestimento(parseInt(investimento_id, 10));
      } else {
        retiradas = await RetiradaModel.findAll();
      }

      res.json({
        success: true,
        message: 'Retiradas encontradas',
        data: retiradas
      });
    } catch (error) {
      console.error('Erro ao buscar retiradas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // GET /api/retiradas/:id
  static async show(req: Request<RouteParams>, res: Response<ApiResponse<RetiradaCompleta>>): Promise<void> {
    try {
      const { id } = req.params;
      const retirada = await RetiradaModel.findById(parseInt(id, 10));
      
      if (!retirada) {
        res.status(404).json({
          success: false,
          message: 'Retirada não encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Retirada encontrada',
        data: retirada
      });
    } catch (error) {
      console.error('Erro ao buscar retirada:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // POST /api/retiradas
  static async store(req: Request<{}, ApiResponse, CreateRetiradaDto>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { investimento_id, valor, data_retirada, observacoes } = req.body;

      // Validações básicas
      if (!investimento_id || !valor || !data_retirada) {
        res.status(400).json({
          success: false,
          message: 'Investimento, valor e data da retirada são obrigatórios'
        });
        return;
      }

      // Verificar se o investimento existe
      const investimento = await InvestimentoModel.findById(investimento_id);
      if (!investimento) {
        res.status(404).json({
          success: false,
          message: 'Investimento não encontrado'
        });
        return;
      }

      // Verificar saldo disponível
      const totalAportes = await AporteModel.getTotalByInvestimento(investimento_id);
      const totalRetiradas = await RetiradaModel.getTotalByInvestimento(investimento_id);
      
      // Garantir que os valores são números
      const totalAportesNum = typeof totalAportes === 'number' ? totalAportes : parseFloat(String(totalAportes)) || 0;
      const totalRetiradasNum = typeof totalRetiradas === 'number' ? totalRetiradas : parseFloat(String(totalRetiradas)) || 0;
      const saldoAtual = totalAportesNum - totalRetiradasNum;

      if (valor > saldoAtual) {
        res.status(400).json({
          success: false,
          message: `Valor excede o saldo disponível (R$ ${saldoAtual.toFixed(2)})`
        });
        return;
      }

      const retirada = await RetiradaModel.create({
        investimento_id,
        valor,
        data_retirada,
        observacoes
      });
      
      res.status(201).json({
        success: true,
        message: 'Retirada registrada com sucesso',
        data: retirada
      });
    } catch (error) {
      console.error('Erro ao criar retirada:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // PUT /api/retiradas/:id
  static async update(req: Request<RouteParams, ApiResponse, UpdateRetiradaDto>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const { valor, data_retirada, observacoes } = req.body;

      const updated = await RetiradaModel.update(parseInt(id, 10), {
        valor,
        data_retirada,
        observacoes
      });
      
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Retirada não encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Retirada atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar retirada:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // DELETE /api/retiradas/:id
  static async destroy(req: Request<RouteParams>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await RetiradaModel.delete(parseInt(id, 10));
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Retirada não encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Retirada removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover retirada:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // GET /api/retiradas/investimento/:id/saldo
  static async getSaldoDisponivel(req: Request<RouteParams>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const investimentoId = parseInt(id, 10);

      // Verificar se o investimento existe
      const investimento = await InvestimentoModel.findById(investimentoId);
      if (!investimento) {
        res.status(404).json({
          success: false,
          message: 'Investimento não encontrado'
        });
        return;
      }

      // Calcular saldo disponível
      const totalAportes = await AporteModel.getTotalByInvestimento(investimentoId);
      const totalRetiradas = await RetiradaModel.getTotalByInvestimento(investimentoId);
      
      // Garantir que os valores são números
      const totalAportesNum = typeof totalAportes === 'number' ? totalAportes : parseFloat(String(totalAportes)) || 0;
      const totalRetiradasNum = typeof totalRetiradas === 'number' ? totalRetiradas : parseFloat(String(totalRetiradas)) || 0;
      const saldoAtual = totalAportesNum - totalRetiradasNum;

      res.json({
        success: true,
        message: 'Saldo calculado com sucesso',
        data: {
          investimento_id: investimentoId,
          investimento_titulo: investimento.titulo,
          totalAportes: parseFloat(totalAportesNum.toFixed(2)),
          totalRetiradas: parseFloat(totalRetiradasNum.toFixed(2)),
          saldoAtual: parseFloat(saldoAtual.toFixed(2))
        }
      });
    } catch (error) {
      console.error('Erro ao calcular saldo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
} 
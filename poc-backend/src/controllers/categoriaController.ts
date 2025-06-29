import { Request, Response } from 'express';
import { CategoriaModel } from '../models/Categoria';
import { 
  ApiResponse, 
  Categoria, 
  CreateCategoriaDto, 
  UpdateCategoriaDto,
  RouteParams
} from '../types';

export class CategoriaController {
  // GET /api/categorias
  static async index(req: Request, res: Response<ApiResponse<Categoria[]>>): Promise<void> {
    try {
      const categorias = await CategoriaModel.findAll();
      res.json({
        success: true,
        message: 'Categorias encontradas',
        data: categorias
      });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // GET /api/categorias/:id
  static async show(req: Request<RouteParams>, res: Response<ApiResponse<Categoria>>): Promise<void> {
    try {
      const { id } = req.params;
      const categoria = await CategoriaModel.findById(parseInt(id, 10));
      
      if (!categoria) {
        res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Categoria encontrada',
        data: categoria
      });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // POST /api/categorias
  static async store(req: Request<{}, ApiResponse, CreateCategoriaDto>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { nome, descricao } = req.body;

      if (!nome) {
        res.status(400).json({
          success: false,
          message: 'Nome da categoria é obrigatório'
        });
        return;
      }

      const categoria = await CategoriaModel.create({ nome, descricao });
      
      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: categoria
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      
      if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com este nome'
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

  // PUT /api/categorias/:id
  static async update(req: Request<RouteParams, ApiResponse, UpdateCategoriaDto>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      if (!nome) {
        res.status(400).json({
          success: false,
          message: 'Nome da categoria é obrigatório'
        });
        return;
      }

      const updated = await CategoriaModel.update(parseInt(id, 10), { nome, descricao });
      
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Categoria atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      
      if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com este nome'
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

  // DELETE /api/categorias/:id
  static async destroy(req: Request<RouteParams>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await CategoriaModel.delete(parseInt(id, 10));
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Categoria removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      
      if (error instanceof Error && 'code' in error && error.code === 'ER_ROW_IS_REFERENCED_2') {
        res.status(400).json({
          success: false,
          message: 'Não é possível remover categoria que possui investimentos associados'
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
} 
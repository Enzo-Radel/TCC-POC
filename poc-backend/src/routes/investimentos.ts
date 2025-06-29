import express from 'express';
import { InvestimentoController } from '../controllers/investimentoController';

const router = express.Router();

// GET /api/investimentos - Listar todos os investimentos
router.get('/', InvestimentoController.index);

// GET /api/investimentos/:id - Buscar investimento por ID
router.get('/:id', InvestimentoController.show);

// POST /api/investimentos - Criar novo investimento
router.post('/', InvestimentoController.store);

// PUT /api/investimentos/:id - Atualizar investimento
router.put('/:id', InvestimentoController.update);

// DELETE /api/investimentos/:id - Remover investimento
router.delete('/:id', InvestimentoController.destroy);

export default router; 
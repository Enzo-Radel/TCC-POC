import express from 'express';
import { RetiradaController } from '../controllers/retiradaController';

const router = express.Router();

// GET /api/retiradas - Listar todas as retiradas
router.get('/', RetiradaController.index);

// GET /api/retiradas/investimento/:id/saldo - Buscar saldo disponível
router.get('/investimento/:id/saldo', RetiradaController.getSaldoDisponivel);

// GET /api/retiradas/:id - Buscar retirada por ID
router.get('/:id', RetiradaController.show);

// POST /api/retiradas - Criar nova retirada
router.post('/', RetiradaController.store);

// PUT /api/retiradas/:id - Atualizar retirada
router.put('/:id', RetiradaController.update);

// DELETE /api/retiradas/:id - Remover retirada
router.delete('/:id', RetiradaController.destroy);

export default router; 
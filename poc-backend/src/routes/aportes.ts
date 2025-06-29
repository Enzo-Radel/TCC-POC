import express from 'express';
import { AporteController } from '../controllers/aporteController';

const router = express.Router();

// GET /api/aportes - Listar todos os aportes
router.get('/', AporteController.index);

// GET /api/aportes/:id - Buscar aporte por ID
router.get('/:id', AporteController.show);

// POST /api/aportes - Criar novo aporte
router.post('/', AporteController.store);

// PUT /api/aportes/:id - Atualizar aporte
router.put('/:id', AporteController.update);

// DELETE /api/aportes/:id - Remover aporte
router.delete('/:id', AporteController.destroy);

// GET /api/aportes/total/:investimento_id - Obter total de aportes por investimento
router.get('/total/:investimento_id', AporteController.getTotalByInvestimento);

export default router; 
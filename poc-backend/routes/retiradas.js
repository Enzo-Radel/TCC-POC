const express = require('express');
const router = express.Router();
const retiradaController = require('../controllers/retiradaController');

// Listar todas as retiradas ou filtrar por investimento
// GET /api/retiradas?investimento_id=1
router.get('/', retiradaController.getRetiradas);

// Buscar retirada por ID
// GET /api/retiradas/1
router.get('/:id', retiradaController.getRetiradaById);

// Criar nova retirada
// POST /api/retiradas
router.post('/', retiradaController.createRetirada);

// Atualizar retirada
// PUT /api/retiradas/1
router.put('/:id', retiradaController.updateRetirada);

// Deletar retirada
// DELETE /api/retiradas/1
router.delete('/:id', retiradaController.deleteRetirada);

// Obter total de retiradas por investimento
// GET /api/retiradas/investimento/1/total
router.get('/investimento/:investimento_id/total', retiradaController.getTotalRetiradas);

// Verificar saldo disponível para retirada
// GET /api/retiradas/investimento/1/saldo?valor=1000
router.get('/investimento/:investimento_id/saldo', retiradaController.verificarSaldo);

module.exports = router; 
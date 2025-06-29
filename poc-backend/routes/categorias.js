const express = require('express');
const CategoriaController = require('../controllers/categoriaController');

const router = express.Router();

// GET /api/categorias - Listar todas as categorias
router.get('/', CategoriaController.index);

// GET /api/categorias/:id - Buscar categoria por ID
router.get('/:id', CategoriaController.show);

// POST /api/categorias - Criar nova categoria
router.post('/', CategoriaController.store);

// PUT /api/categorias/:id - Atualizar categoria
router.put('/:id', CategoriaController.update);

// DELETE /api/categorias/:id - Remover categoria
router.delete('/:id', CategoriaController.destroy);

module.exports = router; 
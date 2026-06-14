const express = require('express');
const router = express.Router();
const { listarCategorias } = require('../Controllers/categoria_controller');

router.get('/', listarCategorias);

module.exports = router;

const express = require('express');
const router = express.Router();
const carritoController = require('../Controllers/carrito_controller');
const verificarToken = require('../middlewares/verificarToken');

router.get('/', verificarToken, carritoController.listarCarrito);
router.post('/', verificarToken, carritoController.agregarCarrito);
router.put('/:id', verificarToken, carritoController.actualizarCantidad);
router.delete('/:id', verificarToken, carritoController.quitarCarrito);

module.exports = router;

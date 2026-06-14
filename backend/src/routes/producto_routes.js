const express = require('express');
const router = express.Router();
const productoController = require('../Controllers/producto_controller');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');

router.get('/', productoController.listarProductos);
router.get('/admin/todos', verificarToken, verificarAdmin, productoController.listarProductosAdmin);
router.get('/:id', productoController.obtenerProducto);
router.post('/', verificarToken, verificarAdmin, productoController.crearProducto);
router.put('/estado/:id', verificarToken, verificarAdmin, productoController.cambiarEstadoProducto);
router.put('/:id', verificarToken, verificarAdmin, productoController.actualizarProducto);

module.exports = router;

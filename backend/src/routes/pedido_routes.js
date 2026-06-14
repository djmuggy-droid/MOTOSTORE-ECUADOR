const express = require("express");
const router = express.Router();

const pedidoController = require("../Controllers/pedido_controller");
const verificarToken = require("../middlewares/verificarToken");

router.post("/", verificarToken, pedidoController.crearPedido);
router.get("/", verificarToken, pedidoController.listarPedidos);

module.exports = router;
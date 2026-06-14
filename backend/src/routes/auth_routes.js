const express = require('express');
const router = express.Router();
const { registrarUsuario, iniciarSesion } = require('../Controllers/auth_controller');

router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);

module.exports = router;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../bd/connection');

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, telefono, direccion } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const [existe] = await pool.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo]);

    if (existe.length > 0) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    const passwordEncriptado = await bcrypt.hash(password, 10);

    const [resultado] = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password, telefono, direccion, rol, estado_activo)
       VALUES (?, ?, ?, ?, ?, 'user', TRUE)`,
      [nombre, correo, passwordEncriptado, telefono || null, direccion || null]
    );

    res.status(201).json({ mensaje: 'Usuario registrado correctamente.', id_usuario: resultado.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario.', error: error.message });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' });
    }

    const [usuarios] = await pool.query(
      `SELECT id_usuario, nombre, correo, password, telefono, direccion, rol
       FROM usuarios
       WHERE correo = ? AND estado_activo = TRUE`,
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    const usuario = usuarios[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }

    const payload = {
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      rol: usuario.rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

    res.json({
      mensaje: 'Inicio de sesión correcto.',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión.', error: error.message });
  }
};

module.exports = { registrarUsuario, iniciarSesion };

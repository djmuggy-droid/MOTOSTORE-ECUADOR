const pool = require('../bd/connection');

const listarCategorias = async (req, res) => {
  try {
    const [categorias] = await pool.query(
      'SELECT id_categoria, nombre, descripcion FROM categorias ORDER BY id_categoria ASC'
    );
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar categorías.', error: error.message });
  }
};

module.exports = { listarCategorias };

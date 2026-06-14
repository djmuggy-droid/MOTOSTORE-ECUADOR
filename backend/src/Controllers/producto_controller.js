const pool = require('../bd/connection');

const listarProductos = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT p.*, c.nombre AS categoria
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.estado_activo = TRUE
      ORDER BY p.id_producto DESC
    `);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar productos.', error: error.message });
  }
};

const listarProductosAdmin = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT p.*, c.nombre AS categoria
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id_producto DESC
    `);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar productos para administrador.', error: error.message });
  }
};

const obtenerProducto = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT p.*, c.nombre AS categoria
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ? AND p.estado_activo = TRUE
    `, [req.params.id]);

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o inactivo.' });
    }

    res.json(productos[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto.', error: error.message });
  }
};

const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, marca, modelo_compatible, precio, stock, imagen_url, id_categoria } = req.body;

    if (!nombre || !precio || stock === undefined || !id_categoria) {
      return res.status(400).json({ mensaje: 'Nombre, precio, stock y categoría son obligatorios.' });
    }

    const [resultado] = await pool.query(`
      INSERT INTO productos (nombre, descripcion, marca, modelo_compatible, precio, stock, imagen_url, id_categoria, estado_activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `, [nombre, descripcion || '', marca || '', modelo_compatible || '', precio, stock, imagen_url || '', id_categoria]);

    res.status(201).json({ mensaje: 'Producto creado correctamente.', id_producto: resultado.insertId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto.', error: error.message });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, marca, modelo_compatible, precio, stock, imagen_url, id_categoria } = req.body;

    await pool.query(`
      UPDATE productos
      SET nombre = ?, descripcion = ?, marca = ?, modelo_compatible = ?, precio = ?, stock = ?, imagen_url = ?, id_categoria = ?
      WHERE id_producto = ?
    `, [nombre, descripcion || '', marca || '', modelo_compatible || '', precio, stock, imagen_url || '', id_categoria, req.params.id]);

    res.json({ mensaje: 'Producto actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto.', error: error.message });
  }
};

const cambiarEstadoProducto = async (req, res) => {
  try {
    const { estado_activo } = req.body;

    if (estado_activo === undefined) {
      return res.status(400).json({ mensaje: 'Debe enviar estado_activo.' });
    }

    const [resultado] = await pool.query(
      'UPDATE productos SET estado_activo = ? WHERE id_producto = ?',
      [estado_activo, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    res.json({ mensaje: estado_activo ? 'Producto activado correctamente.' : 'Producto desactivado correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar estado del producto.', error: error.message });
  }
};

module.exports = {
  listarProductos,
  listarProductosAdmin,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto
};

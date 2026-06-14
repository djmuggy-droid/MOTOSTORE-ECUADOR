const pool = require('../bd/connection');

const listarCarrito = async (req, res) => {
  try {
    const idUsuario = req.usuario.id_usuario;
    const [items] = await pool.query(`
      SELECT c.id_carrito, c.id_usuario, c.id_producto, c.cantidad,
             p.nombre, p.precio, p.stock, p.imagen_url, p.marca, p.modelo_compatible,
             (c.cantidad * p.precio) AS subtotal
      FROM carrito c
      INNER JOIN productos p ON c.id_producto = p.id_producto
      WHERE c.id_usuario = ? AND p.estado_activo = TRUE
      ORDER BY c.id_carrito DESC
    `, [idUsuario]);

    const total = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
    const cantidadTotal = items.reduce((acc, item) => acc + Number(item.cantidad), 0);

    res.json({ items, total, cantidadTotal });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar carrito.', error: error.message });
  }
};

const agregarCarrito = async (req, res) => {
  try {
    const idUsuario = req.usuario.id_usuario;
    const { id_producto, cantidad = 1 } = req.body;

    if (!id_producto) {
      return res.status(400).json({ mensaje: 'Debe enviar el producto.' });
    }

    const [producto] = await pool.query(
      'SELECT id_producto, stock, estado_activo FROM productos WHERE id_producto = ?',
      [id_producto]
    );

    if (producto.length === 0 || !producto[0].estado_activo) {
      return res.status(404).json({ mensaje: 'Producto no disponible.' });
    }

    if (Number(cantidad) > Number(producto[0].stock)) {
      return res.status(400).json({ mensaje: 'No hay stock suficiente.' });
    }

    const [existente] = await pool.query(
      'SELECT id_carrito, cantidad FROM carrito WHERE id_usuario = ? AND id_producto = ?',
      [idUsuario, id_producto]
    );

    if (existente.length > 0) {
      const nuevaCantidad = Number(existente[0].cantidad) + Number(cantidad);
      if (nuevaCantidad > Number(producto[0].stock)) {
        return res.status(400).json({ mensaje: 'No hay stock suficiente.' });
      }
      await pool.query('UPDATE carrito SET cantidad = ? WHERE id_carrito = ?', [nuevaCantidad, existente[0].id_carrito]);
    } else {
      await pool.query(
        'INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)',
        [idUsuario, id_producto, cantidad]
      );
    }

    res.status(201).json({ mensaje: 'Producto agregado al carrito.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar al carrito.', error: error.message });
  }
};

const actualizarCantidad = async (req, res) => {
  try {
    const idUsuario = req.usuario.id_usuario;
    const { cantidad } = req.body;
    const { id } = req.params;

    if (Number(cantidad) <= 0) {
      await pool.query('DELETE FROM carrito WHERE id_carrito = ? AND id_usuario = ?', [id, idUsuario]);
      return res.json({ mensaje: 'Producto retirado del carrito.' });
    }

    const [item] = await pool.query(`
      SELECT c.id_carrito, p.stock
      FROM carrito c
      INNER JOIN productos p ON c.id_producto = p.id_producto
      WHERE c.id_carrito = ? AND c.id_usuario = ?
    `, [id, idUsuario]);

    if (item.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado en carrito.' });
    }

    if (Number(cantidad) > Number(item[0].stock)) {
      return res.status(400).json({ mensaje: 'La cantidad supera el stock disponible.' });
    }

    await pool.query('UPDATE carrito SET cantidad = ? WHERE id_carrito = ? AND id_usuario = ?', [cantidad, id, idUsuario]);
    res.json({ mensaje: 'Cantidad actualizada.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cantidad.', error: error.message });
  }
};

const quitarCarrito = async (req, res) => {
  try {
    const idUsuario = req.usuario.id_usuario;
    await pool.query('DELETE FROM carrito WHERE id_carrito = ? AND id_usuario = ?', [req.params.id, idUsuario]);
    res.json({ mensaje: 'Producto retirado del carrito.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al quitar producto.', error: error.message });
  }
};

module.exports = { listarCarrito, agregarCarrito, actualizarCantidad, quitarCarrito };

const pool = require("../bd/connection");

const crearPedido = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const idUsuario = req.usuario.id_usuario;

    const [items] = await connection.query(
      `
      SELECT 
        c.id_carrito,
        c.id_usuario,
        c.id_producto,
        c.cantidad,
        p.nombre,
        p.precio,
        p.stock,
        p.estado_activo
      FROM carrito c
      INNER JOIN productos p ON c.id_producto = p.id_producto
      WHERE c.id_usuario = ?
      AND p.estado_activo = TRUE
      `,
      [idUsuario]
    );

    if (items.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        mensaje: "El carrito está vacío.",
      });
    }

    const sinStock = items.find(
      (item) => Number(item.cantidad) > Number(item.stock)
    );

    if (sinStock) {
      await connection.rollback();
      return res.status(400).json({
        mensaje: `No hay stock suficiente para ${sinStock.nombre}.`,
      });
    }

    const total = items.reduce(
      (acc, item) => acc + Number(item.precio) * Number(item.cantidad),
      0
    );

    const [pedidoResult] = await connection.query(
      `
      INSERT INTO pedidos 
      (id_usuario, total, estado, fecha_pedido)
      VALUES (?, ?, ?, NOW())
      `,
      [idUsuario, total, "pagado"]
    );

    const idPedido = pedidoResult.insertId;

    const detalleValores = items.map((item) => [
      idPedido,
      item.id_producto,
      item.cantidad,
      item.precio,
      Number(item.precio) * Number(item.cantidad),
    ]);

    await connection.query(
      `
      INSERT INTO detalle_pedido
      (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
      VALUES ?
      `,
      [detalleValores]
    );

    for (const item of items) {
      await connection.query(
        `
        UPDATE productos
        SET stock = stock - ?
        WHERE id_producto = ?
        `,
        [item.cantidad, item.id_producto]
      );
    }

    await connection.query(
      `
      DELETE FROM carrito
      WHERE id_usuario = ?
      `,
      [idUsuario]
    );

    await connection.commit();

    res.status(201).json({
      mensaje: "Pedido creado correctamente.",
      id_pedido: idPedido,
      total,
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      mensaje: "Error al crear pedido.",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

const listarPedidos = async (req, res) => {
  try {
    const usuario = req.usuario;

    let sql = `
      SELECT 
        p.id_pedido,
        p.id_usuario,
        u.nombre AS cliente,
        u.correo,
        p.total,
        p.estado,
        p.fecha_pedido
      FROM pedidos p
      INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    `;

    const params = [];

    if (usuario.rol !== "admin") {
      sql += ` WHERE p.id_usuario = ? `;
      params.push(usuario.id_usuario);
    }

    sql += ` ORDER BY p.id_pedido DESC `;

    const [pedidos] = await pool.query(sql, params);

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar pedidos.",
      error: error.message,
    });
  }
};

module.exports = {
  crearPedido,
  listarPedidos,
};
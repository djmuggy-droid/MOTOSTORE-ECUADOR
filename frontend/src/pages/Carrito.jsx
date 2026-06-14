import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Carrito({ onCartChange }) {
  const [elementos, setElementos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [factura, setFactura] = useState(null);

  const [datosCompra, setDatosCompra] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    tarjeta: "",
    vencimiento: "",
    cvv: "",
  });

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
  try {
    setCargando(true);

    const respuesta = await api.get("/carrito");

    const carrito = respuesta.data.items || [];
    const cantidadTotal = respuesta.data.cantidadTotal || 0;

    setElementos(carrito);

    localStorage.setItem("cantidadCarrito", cantidadTotal);
    window.dispatchEvent(new Event("carritoActualizado"));
  } catch (error) {
    console.error("Error al cargar carrito:", error);

    setElementos([]);
    localStorage.setItem("cantidadCarrito", 0);
    window.dispatchEvent(new Event("carritoActualizado"));
  } finally {
    setCargando(false);
  }
};
  const actualizarCantidad = async (id, cantidad) => {
    if (cantidad <= 0) {
      quitarProducto(id);
      return;
    }

    await api.put(`/carrito/${id}`, { cantidad });
    await cargarCarrito();

    if (onCartChange) onCartChange();
  };

  const quitarProducto = async (id) => {
    await api.put(`/carrito/quitar/${id}`);
    await cargarCarrito();

    if (onCartChange) onCartChange();
  };

  const manejarCambio = (e) => {
    setDatosCompra({
      ...datosCompra,
      [e.target.name]: e.target.value,
    });
  };

  const total = elementos.reduce(
  (acumulado, item) => acumulado + Number(item.subtotal || 0),
  0
);

  const pagarYGenerarFactura = async (e) => {
    e.preventDefault();

    if (elementos.length === 0) {
      setMensaje("El carrito está vacío.");
      return;
    }

    if (
      !datosCompra.nombre ||
      !datosCompra.telefono ||
      !datosCompra.direccion ||
      !datosCompra.ciudad ||
      !datosCompra.tarjeta ||
      !datosCompra.vencimiento ||
      !datosCompra.cvv
    ) {
      setMensaje("Completa todos los datos de compra y pago.");
      return;
    }

    try {
      const respuesta = await api.post("/pedidos");

      const nuevaFactura = {
        numero: respuesta.data.id_pedido,
        fecha: new Date().toLocaleString(),
        cliente: datosCompra.nombre,
        telefono: datosCompra.telefono,
        direccion: datosCompra.direccion,
        ciudad: datosCompra.ciudad,
        metodoPago: `Tarjeta terminada en ${datosCompra.tarjeta.slice(-4)}`,
        productos: elementos,
        total: total,
      };

      setFactura(nuevaFactura);
      setMensaje("Compra realizada correctamente. Factura generada.");
      setElementos([]);

      localStorage.setItem("cantidadCarrito", 0);
      window.dispatchEvent(new Event("carritoActualizado"));

      if (onCartChange) onCartChange();
    } catch (error) {
      console.error("Error al comprar:", error);
      setMensaje(
        error.response?.data?.mensaje || "Error al procesar la compra."
      );
    }
  };

  if (cargando) {
    return (
      <main className="page-container">
        <div className="loading-state">
          <h2>Cargando carrito...</h2>
          <p>Estamos preparando tu compra.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-header">
        <span className="badge">🛒 Compra en línea</span>
        <h1>Finaliza tu compra</h1>
        <p>
          Revisa tus productos, completa los datos de entrega y realiza el pago
          simulado para generar tu factura.
        </p>
      </section>

      {factura ? (
        <section className="factura-card">
          <div className="factura-header">
            <div>
              <span className="badge">✅ Factura generada</span>
              <h2>Factura MotoStore #{factura.numero}</h2>
              <p>Fecha: {factura.fecha}</p>
            </div>

            <button className="btn-dark" onClick={() => window.print()}>
              Imprimir factura
            </button>
          </div>

          <div className="factura-info">
            <div>
              <strong>Cliente</strong>
              <p>{factura.cliente}</p>
            </div>

            <div>
              <strong>Teléfono</strong>
              <p>{factura.telefono}</p>
            </div>

            <div>
              <strong>Ciudad</strong>
              <p>{factura.ciudad}</p>
            </div>

            <div>
              <strong>Dirección</strong>
              <p>{factura.direccion}</p>
            </div>

            <div>
              <strong>Método de pago</strong>
              <p>{factura.metodoPago}</p>
            </div>
          </div>

          <div className="factura-productos">
            {factura.productos.map((item) => (
              <div className="factura-producto" key={item.id_carrito}>
                <span>{item.nombre}</span>
                <span>
                  {item.cantidad} x ${Number(item.precio).toFixed(2)}
                </span>
                <strong>
                  ${(Number(item.precio) * Number(item.cantidad)).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="factura-total">
            <span>Total pagado</span>
            <strong>${Number(factura.total).toFixed(2)}</strong>
          </div>

          <Link className="btn-primary" to="/productos">
            Seguir comprando
          </Link>
        </section>
      ) : elementos.length === 0 ? (
        <div className="empty-state">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el catálogo para simular una compra.</p>
          <Link className="btn-primary" to="/productos">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <section className="checkout-layout">
          <div className="cart-list">
            {elementos.map((item) => (
              <article className="cart-card" key={item.id_carrito}>
                <img src={item.imagen_url} alt={item.nombre} />

                <div>
                  <h3>{item.nombre}</h3>
                  <p>Precio: ${Number(item.precio).toFixed(2)}</p>
                  <p>
                    Subtotal: $
                    {(Number(item.precio) * Number(item.cantidad)).toFixed(2)}
                  </p>
                </div>

                <div className="cart-actions">
                  <button
                    onClick={() =>
                      actualizarCantidad(item.id_carrito, item.cantidad - 1)
                    }
                  >
                    -
                  </button>

                  <strong>{item.cantidad}</strong>

                  <button
                    onClick={() =>
                      actualizarCantidad(item.id_carrito, item.cantidad + 1)
                    }
                  >
                    +
                  </button>

                  <button
                    className="danger-mini"
                    onClick={() => quitarProducto(item.id_carrito)}
                  >
                    x
                  </button>
                </div>
              </article>
            ))}
          </div>

          <form className="checkout-form" onSubmit={pagarYGenerarFactura}>
            <h2>Datos de entrega</h2>

            <input
              name="nombre"
              placeholder="Nombre completo"
              value={datosCompra.nombre}
              onChange={manejarCambio}
            />

            <input
              name="telefono"
              placeholder="Teléfono"
              value={datosCompra.telefono}
              onChange={manejarCambio}
            />

            <input
              name="ciudad"
              placeholder="Ciudad"
              value={datosCompra.ciudad}
              onChange={manejarCambio}
            />

            <textarea
              name="direccion"
              placeholder="Dirección de entrega"
              value={datosCompra.direccion}
              onChange={manejarCambio}
            />

            <h2>Pago simulado</h2>

            <input
              name="tarjeta"
              placeholder="Número de tarjeta"
              maxLength="16"
              value={datosCompra.tarjeta}
              onChange={manejarCambio}
            />

            <div className="payment-row">
              <input
                name="vencimiento"
                placeholder="MM/AA"
                value={datosCompra.vencimiento}
                onChange={manejarCambio}
              />

              <input
                name="cvv"
                placeholder="CVV"
                maxLength="3"
                value={datosCompra.cvv}
                onChange={manejarCambio}
              />
            </div>

            <div className="checkout-total">
              <span>Total a pagar</span>
              <strong>${Number(total).toFixed(2)}</strong>
            </div>

            <button type="submit">Pagar y generar factura</button>

            {mensaje && <p className="success-text">{mensaje}</p>}
          </form>
        </section>
      )}
    </main>
  );
}

export default Carrito;
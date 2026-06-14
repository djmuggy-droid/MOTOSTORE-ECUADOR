import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const respuesta = await api.get("/pedidos");
      setPedidos(respuesta.data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setCargando(false);
    }
  };

  if (!usuario || usuario.rol !== "admin") {
    return (
      <main className="page-container">
        <div className="empty-state">
          <h2>Acceso restringido</h2>
          <p>El historial de pedidos solo está disponible para administradores.</p>
        </div>
      </main>
    );
  }

  if (cargando) {
    return (
      <main className="page-container">
        <div className="loading-state">
          <h2>Cargando pedidos...</h2>
          <p>Consultando compras registradas.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-header">
        <span className="badge">📦 Administración</span>
        <h1>Historial general de pedidos</h1>
        <p>
          Esta sección permite al administrador revisar las compras registradas
          en la tienda.
        </p>
      </section>

      {pedidos.length === 0 ? (
        <div className="empty-state">
          <h2>No existen pedidos registrados</h2>
          <p>Cuando los clientes realicen compras, aparecerán aquí.</p>
        </div>
      ) : (
        <section className="orders-grid">
          {pedidos.map((pedido) => (
            <article className="order-card" key={pedido.id_pedido}>
              <div>
                <h3>Pedido #{pedido.id_pedido}</h3>
                <p>Fecha: {new Date(pedido.fecha_pedido).toLocaleString()}</p>
                <p>Total: ${Number(pedido.total).toFixed(2)}</p>
              </div>

              <span className="order-status">{pedido.estado}</span>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Pedidos;
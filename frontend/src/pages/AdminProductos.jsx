import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const formInicial = {
  nombre: '', descripcion: '', marca: '', modelo_compatible: '', precio: '', stock: '', imagen_url: '', id_categoria: ''
};

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const [resProductos, resCategorias] = await Promise.all([
        api.get('/productos/admin/todos'),
        api.get('/categorias')
      ]);
      setProductos(resProductos.data);
      setCategorias(resCategorias.data);
      if (!form.id_categoria && resCategorias.data.length > 0) {
        setForm((actual) => ({ ...actual, id_categoria: resCategorias.data[0].id_categoria }));
      }
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al cargar información del panel.');
    }
  };

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/productos/${editando}`, form);
        setMensaje('Producto actualizado correctamente.');
      } else {
        await api.post('/productos', form);
        setMensaje('Producto creado correctamente.');
      }
      setForm({ ...formInicial, id_categoria: categorias[0]?.id_categoria || '' });
      setEditando(null);
      cargarDatos();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'No se pudo guardar el producto.');
    }
  };

  const editarProducto = (producto) => {
    setEditando(producto.id_producto);
    setForm({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      marca: producto.marca || '',
      modelo_compatible: producto.modelo_compatible || '',
      precio: producto.precio || '',
      stock: producto.stock || '',
      imagen_url: producto.imagen_url || '',
      id_categoria: producto.id_categoria || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setForm({ ...formInicial, id_categoria: categorias[0]?.id_categoria || '' });
  };

  const cambiarEstado = async (producto) => {
    try {
      await api.put(`/productos/estado/${producto.id_producto}`, { estado_activo: !producto.estado_activo });
      setMensaje(producto.estado_activo ? 'Producto desactivado correctamente.' : 'Producto activado correctamente.');
      cargarDatos();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'No se pudo cambiar el estado.');
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <span className="badge">🛡️ Panel protegido</span>
        <h1>Administración de inventario MotoStore</h1>
        <p>Crear, editar, activar y desactivar productos.</p>
      </section>

      <form className="admin-form" onSubmit={guardar}>
        <input name="nombre" placeholder="Nombre del producto" value={form.nombre} onChange={cambiar} required />
        <input name="marca" placeholder="Marca" value={form.marca} onChange={cambiar} />
        <input name="modelo_compatible" placeholder="Modelo compatible" value={form.modelo_compatible} onChange={cambiar} />
        <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={cambiar} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={cambiar} required />
        <input name="imagen_url" placeholder="URL de imagen" value={form.imagen_url} onChange={cambiar} />
        <select name="id_categoria" value={form.id_categoria} onChange={cambiar} required>
          {categorias.map((cat) => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
        </select>
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={cambiar}></textarea>
        <button type="submit">{editando ? 'Actualizar producto' : 'Crear producto'}</button>
        {editando && <button type="button" className="btn-dark" onClick={cancelarEdicion}>Cancelar</button>}
      </form>

      {mensaje && <p className={mensaje.includes('correctamente') ? 'success-text admin-message' : 'error-text admin-message'}>{mensaje}</p>}

      <section className="admin-list">
        {productos.map((producto) => (
          <article className="admin-item" key={producto.id_producto}>
            <div className="admin-product-main">
              <img src={producto.imagen_url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80'} alt={producto.nombre} />
              <div>
                <h3>{producto.nombre}</h3>
                <p>{producto.categoria} · {producto.marca} · Stock {producto.stock}</p>
                <strong>${Number(producto.precio).toFixed(2)}</strong>
              </div>
            </div>
            <span className={producto.estado_activo ? 'estado-activo' : 'estado-inactivo'}>
              {producto.estado_activo ? 'Activo' : 'Inactivo'}
            </span>
            <div className="admin-buttons">
              <button className="btn-dark" onClick={() => editarProducto(producto)}>Editar</button>
              <button className={producto.estado_activo ? 'btn-danger' : 'btn-success'} onClick={() => cambiarEstado(producto)}>
                {producto.estado_activo ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AdminProductos;

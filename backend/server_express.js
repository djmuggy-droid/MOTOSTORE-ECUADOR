const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./src/bd/connection');

const authRoutes = require('./src/routes/auth_routes');
const categoriaRoutes = require('./src/routes/categoria_routes');
const productoRoutes = require('./src/routes/producto_routes');
const carritoRoutes = require('./src/routes/carrito_routes');
const pedidoRoutes = require('./src/routes/pedido_routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor MotoStore Ecuador funcionando correctamente');
});

app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor MotoStore ejecutándose en el puerto ${PORT}`);
});
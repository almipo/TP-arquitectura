import express from 'express';
import productosRoutes from './routes/producto.routes.js';
import categoriasRoutes from './routes/categoria.routes.js';
import proveedoresRoutes from './routes/proveedor.routes.js';


const app = express();

// Middleware para parsear JSON 
app.use(express.json());

// Rutas principales
app.use('/api/producto', productosRoutes);
app.use('/api/categoria', categoriasRoutes);
app.use('/api/proveedor', proveedoresRoutes);


export default app;

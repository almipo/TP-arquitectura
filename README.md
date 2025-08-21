# 📦 API Control de Stock

Este proyecto es una **API REST** para la gestión de productos y control de inventario.  
Permite realizar operaciones básicas de **CRUD** (Crear, Leer, Actualizar, Eliminar) sobre los productos, además de algunos métodos adicionales para mejorar el manejo del stock.

---

## 🔹 Endpoints disponibles

### 📌 Productos (CRUD)
- **GET** `/api/productos` → Listar todos los productos.  
- **GET** `/api/productos/{id}` → Obtener un producto por su ID.  
- **POST** `/api/productos` → Crear un nuevo producto.  
- **PUT** `/api/productos/{id}` → Actualizar un producto existente.  
- **DELETE** `/api/productos/{id}` → Eliminar un producto.  

### 📌 Métodos adicionales
- **GET** `/api/productos/stock-bajo` → Listar productos con stock menor al mínimo definido.  
- **POST** `/api/movimientos` → Registrar entrada o salida de stock.  
- **GET** `/api/reportes/mas-vendidos` → Consultar productos más vendidos.  

---

## 🚀 Objetivo

El objetivo de esta API es brindar un sistema sencillo y extensible para controlar el inventario, permitiendo no solo gestionar productos, sino también obtener información útil para la toma de decisiones (alertas de stock bajo y reportes de ventas).

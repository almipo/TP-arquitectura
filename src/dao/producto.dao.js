import fs from "fs";
import path from "path";
import { ProductoModel } from "../models/producto.model.js";

export class ProductoDAO {
  constructor() {
    this.dataPath = path.join("src", "data", "producto.json");
    this._asegurarArchivo();
  }

  //  Asegura que el archivo exista
  _asegurarArchivo() {
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([]));
    }
  }

  // Lee todos los productos
  _leerProductos() {
    const data = fs.readFileSync(this.dataPath, "utf8");
    return JSON.parse(data);
  }

  // Guarda productos en archivo
  _guardarProductos(productos) {
    fs.writeFileSync(this.dataPath, JSON.stringify(productos, null, 2));
  }

  obtenerTodos() {
    return this._leerProductos();
  }

  obtenerPorId(id) {
    const productos = this._leerProductos();
    return productos.find(p => p.id === Number(id)) || null;
  }

  crear(data) {
    const productos = this._leerProductos();

    const { nombre, precio, stock, categoriaId, proveedorId, descripcion } = data;

    if (!nombre) throw new Error("El nombre es obligatorio");
    if (precio == null || precio < 0) throw new Error("Precio inválido");
    if (stock == null || stock < 0) throw new Error("Stock inválido");

    const id = productos.length ? productos[productos.length - 1].id + 1 : 1;

    const nuevoProducto = new ProductoModel(
      id,
      nombre,
      precio,
      stock,
      categoriaId,
      proveedorId,
      descripcion
    );

    productos.push(nuevoProducto);
    this._guardarProductos(productos);

    return nuevoProducto;
  }

  actualizar(id, data) {
    const productos = this._leerProductos();
    const index = productos.findIndex(p => p.id === Number(id));
    if (index === -1) return null;

    const { nombre, precio, stock, categoriaId, proveedorId, descripcion } = data;

    if (!nombre) throw new Error("El nombre es obligatorio");
    if (precio == null || precio < 0) throw new Error("Precio inválido");
    if (stock == null || stock < 0) throw new Error("Stock inválido");

    productos[index] = new ProductoModel(
      Number(id),
      nombre,
      precio,
      stock,
      categoriaId,
      proveedorId,
      descripcion
    );

    this._guardarProductos(productos);
    return productos[index];
  }

  actualizarParcial(id, dataParcial) {
    const productos = this._leerProductos();
    const producto = productos.find(p => p.id === Number(id));
    if (!producto) return null;

    Object.assign(producto, dataParcial);
    this._guardarProductos(productos);
    return producto;
  }

  eliminar(id) {
    const productos = this._leerProductos();
    const index = productos.findIndex(p => p.id === Number(id));
    if (index === -1) return null;

    const eliminado = productos.splice(index, 1)[0];
    this._guardarProductos(productos);
    return eliminado;
  }

 
  obtenerPorCategoriaId(categoriaId) {
    const productos = this._leerProductos();
    return productos.filter(p => p.categoriaId === Number(categoriaId));
  }

 
  obtenerPorProveedorId(proveedorId) {
    const productos = this._leerProductos();
    return productos.filter(p => p.proveedorId === Number(proveedorId));
  }
}

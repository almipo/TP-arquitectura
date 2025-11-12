import { ProductoDAO } from "../dao/producto.dao.js";
import { CategoriaDAO } from "../dao/categoria.dao.js";
import { ProveedorDAO } from "../dao/proveedor.dao.js";
import { ProductoModel } from "../models/producto.model.js";

export class ProductoService {
  constructor() {
    this.dao = new ProductoDAO();
    this.categoriaDao = new CategoriaDAO();
    this.proveedorDao = new ProveedorDAO();
  }

  async obtenerTodos() {
    return this.dao.obtenerTodos();
  }

  async obtenerPorId(id) {
    const producto = this.dao.obtenerPorId(id);
    if (!producto) throw new Error("Producto no encontrado");
    return producto;
  }

  async crear(data) {
    const { nombre, precio, stock, categoriaId, proveedorId, descripcion } = data;

    if (!nombre) throw new Error("El campo 'nombre' es obligatorio");
    if (precio == null || precio < 0) throw new Error("Precio inválido");
    if (stock == null || stock < 0) throw new Error("Stock inválido");

    if (categoriaId && !this.categoriaDao.obtenerPorId(categoriaId))
      throw new Error("Categoría no encontrada");

    if (proveedorId && !this.proveedorDao.obtenerPorId(proveedorId))
      throw new Error("Proveedor no encontrado");

    const productos = this.dao.obtenerTodos();
    const id = productos.length ? productos[productos.length - 1].id + 1 : 1;

    const nuevoProducto = new ProductoModel(
      id, nombre, precio, stock, categoriaId, proveedorId, descripcion
    );

    return this.dao.crear(nuevoProducto);
  }

  async actualizar(id, data) {
    const existente = this.dao.obtenerPorId(id);
    if (!existente) throw new Error("Producto no encontrado");

    const camposObligatorios = ["nombre", "precio", "stock", "categoriaId", "proveedorId", "descripcion"];
    const faltantes = camposObligatorios.filter(c => !(c in data));
    if (faltantes.length > 0)
      throw new Error(`Faltan campos obligatorios: ${faltantes.join(", ")}`);

    const extras = Object.keys(data).filter(c => !camposObligatorios.includes(c));
    if (extras.length > 0)
      throw new Error(`Campos no permitidos: ${extras.join(", ")}`);

    return this.dao.actualizar(id, data);
  }

  async actualizarParcial(id, data) {
    const existente = this.dao.obtenerPorId(id);
    if (!existente) throw new Error("Producto no encontrado");

    const camposValidos = ["nombre", "precio", "stock", "categoriaId", "proveedorId", "descripcion"];
    const extras = Object.keys(data).filter(c => !camposValidos.includes(c));
    if (extras.length > 0)
      throw new Error(`Campos no permitidos: ${extras.join(", ")}`);

    return this.dao.actualizar(id, data);
  }

  async eliminar(id) {
    const existente = this.dao.obtenerPorId(id);
    if (!existente) throw new Error("Producto no encontrado");
    return this.dao.eliminar(id);
  }

  async obtenerCategoria(productoId) {
    const producto = this.dao.obtenerPorId(productoId);
    if (!producto) throw new Error("Producto no encontrado");
    return this.categoriaDao.obtenerPorId(producto.categoriaId);
  }

  async obtenerProveedor(productoId) {
    const producto = this.dao.obtenerPorId(productoId);
    if (!producto) throw new Error("Producto no encontrado");
    return this.proveedorDao.obtenerPorId(producto.proveedorId);
  }
}

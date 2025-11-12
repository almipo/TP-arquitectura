import { CategoriaDAO } from "../dao/categoria.dao.js";
import { ProductoDAO } from "../dao/producto.dao.js";
import { ProveedorDAO } from "../dao/proveedor.dao.js";
import { CategoriaModel } from "../models/categoria.model.js";

export class CategoriaService {
  constructor() {
    this.dao = new CategoriaDAO();
    this.productoDao = new ProductoDAO();
    this.proveedorDao = new ProveedorDAO();
  }

  async obtenerTodas() {
    return this.dao.obtenerTodas();
  }

  async obtenerPorId(id) {
    const categoria = this.dao.obtenerPorId(id);
    if (!categoria) throw new Error("Categoría no encontrada");
    return categoria;
  }

  async crear(data) {
    if (!data.nombre) throw new Error("El campo 'nombre' es obligatorio");

    const categorias = this.dao.obtenerTodas();
    const nuevoId = categorias.length ? categorias.at(-1).id + 1 : 1;

    const nueva = new CategoriaModel(nuevoId, data.nombre.trim(), data.descripcion || "");
    return this.dao.crear(nueva);
  }

  async actualizar(id, data) {
    const camposEsperados = ["nombre", "descripcion"];
    const claves = Object.keys(data);

    // Verificar campos obligatorios
    for (const campo of camposEsperados) {
      if (!claves.includes(campo)) {
        throw new Error(`Falta el campo obligatorio '${campo}'`);
      }
    }

    // No permitir campos extra
    for (const clave of claves) {
      if (!camposEsperados.includes(clave)) {
        throw new Error(`Campo no permitido: '${clave}'`);
      }
    }

    if (!data.nombre.trim()) throw new Error("El campo 'nombre' no puede estar vacío");

    const existente = this.dao.obtenerPorId(id);
    if (!existente) throw new Error("Categoría no encontrada");

    const actualizada = new CategoriaModel(Number(id), data.nombre.trim(), data.descripcion || "");
    return this.dao.actualizar(id, actualizada);
  }

  async actualizarParcial(id, data) {
    const camposPermitidos = ["nombre", "descripcion"];
    const claves = Object.keys(data);

    if (claves.length === 0) {
      throw new Error("Debe proporcionar al menos un campo para actualizar");
    }

    for (const clave of claves) {
      if (!camposPermitidos.includes(clave)) {
        throw new Error(`Campo no permitido: '${clave}'`);
      }
    }

    if (data.nombre !== undefined && !data.nombre.trim()) {
      throw new Error("El campo 'nombre' no puede estar vacío");
    }

    const existente = this.dao.obtenerPorId(id);
    if (!existente) throw new Error("Categoría no encontrada");

    const actualizada = { ...existente, ...data };
    return this.dao.actualizar(id, actualizada);
  }

  async eliminar(id) {
    const productosAsociados = this.productoDao.obtenerPorCategoriaId(id);
    if (productosAsociados.length > 0) {
      throw new Error("No se puede eliminar una categoría con productos asociados");
    }

    const eliminada = this.dao.eliminar(id);
    if (!eliminada) throw new Error("Categoría no encontrada");
    return eliminada;
  }

  async obtenerProductosPorCategoria(id) {
    return this.productoDao.obtenerPorCategoriaId(id);
  }

  async obtenerProveedoresPorCategoria(id) {
    return this.proveedorDao.obtenerPorCategoriaId(id);
  }
}

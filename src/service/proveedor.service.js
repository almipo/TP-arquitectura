import { ProveedorModel } from "../models/proveedor.model.js";
import { ProveedorDAO } from "../dao/proveedor.dao.js";

export class ProveedorService {
  constructor() {
    this.dao = new ProveedorDAO();
  }

  obtenerTodos() {
    return this.dao.obtenerTodos();
  }

  obtenerPorId(id) {
    return this.dao.obtenerPorId(id);
  }

  crear(data) {
    if (!data.nombre || !data.apellido || !data.dni || !data.cuil || !data.direccion) {
      throw new Error("Todos los campos obligatorios deben estar completos");
    }

    const proveedores = this.dao.obtenerTodos();
    const nuevoId = proveedores.length ? proveedores[proveedores.length - 1].id + 1 : 1;

    const nuevoProveedor = new ProveedorModel(
      nuevoId,
      data.nombre,
      data.apellido,
      data.dni,
      data.cuil,
      data.direccion,
      data.categorias || [],
      data.productos || []
    );

    return this.dao.crear(nuevoProveedor);
  }
actualizar(id, data) {
  const proveedorExistente = this.dao.obtenerPorId(id);
  if (!proveedorExistente) return null;


  const camposValidos = [
    "nombre",
    "apellido",
    "dni",
    "cuil",
    "direccion",
    "categorias",
    "productos",
  ];


  const faltan = camposValidos.filter(campo => !(campo in data));
  if (faltan.length > 0) {
    throw new Error(`Faltan campos obligatorios: ${faltan.join(", ")}`);
  }


  const extras = Object.keys(data).filter(campo => !camposValidos.includes(campo));
  if (extras.length > 0) {
    throw new Error(`Campos no permitidos: ${extras.join(", ")}`);
  }

  return this.dao.actualizar(id, data);
}
actualizarParcial(id, data) {
  const proveedorExistente = this.dao.obtenerPorId(id);
  if (!proveedorExistente) return null;

  const camposValidos = [
    "nombre",
    "apellido",
    "dni",
    "cuil",
    "direccion",
    "categorias",
    "productos",
  ];

  const extras = Object.keys(data).filter(campo => !camposValidos.includes(campo));
  if (extras.length > 0) {
    throw new Error(`Campos no permitidos: ${extras.join(", ")}`);
  }

  // Solo los campos válidos pasan al DAO
  return this.dao.actualizar(id, data);
}

  eliminar(id) {
    return this.dao.eliminar(id);
  }

  obtenerProductos(id) {
    const proveedor = this.dao.obtenerPorId(id);
    if (!proveedor) return null;
    return this.dao.obtenerProductosPorProveedor(id);
  }

  obtenerCategorias(id) {
    const proveedor = this.dao.obtenerPorId(id);
    if (!proveedor) return null;
    return this.dao.obtenerCategoriasPorProveedor(proveedor);
  }
}

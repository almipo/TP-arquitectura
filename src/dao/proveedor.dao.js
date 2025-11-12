import fs from "fs";
import path from "path";
import { ProveedorModel } from "../models/proveedor.model.js";



export class ProveedorDAO {
  constructor() {
    this.dataPath = path.join("src", "data", "proveedor.json");
    this._asegurarArchivo();
  }

  _asegurarArchivo() {
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2), "utf-8");
    }
  }

  _leerProveedores() {
    const data = fs.readFileSync(this.dataPath, "utf-8");
    return JSON.parse(data);
  }


  _guardarProveedores(proveedores) {
    fs.writeFileSync(this.dataPath, JSON.stringify(proveedores, null, 2), "utf-8");
  } 

  obtenerTodos() {
    return this._leerProveedores();
  } 

  obtenerPorId(id) {
    const proveedores = this._leerProveedores();
    return proveedores.find(p => p.id === Number(id)) || null;
  }

  crear(data) {
    const proveedores = this._leerProveedores();
    const { nombre, contacto, telefono } = data;

    if (!nombre) throw new Error("El nombre es obligatorio");
    const id = proveedores.length ? proveedores[proveedores.length - 1].id + 1 : 1;

    const nuevoProveedor = new ProveedorModel(id, nombre, contacto, telefono);
    proveedores.push(nuevoProveedor);
    this._guardarProveedores(proveedores);
    return nuevoProveedor;
  }

actualizar(id, data) {
  const proveedores = this._leerProveedores();
  const index = proveedores.findIndex(p => p.id === Number(id));
  if (index === -1) return null;

  proveedores[index] = { id: Number(id), ...data };
  this._guardarProveedores(proveedores);
  return proveedores[index];
}
  eliminar(id) {
    const proveedores = this._leerProveedores();
    const index = proveedores.findIndex(p => p.id === Number(id));  
    if (index === -1) return null;
    const eliminado = proveedores.splice(index, 1)[0];
    this._guardarProveedores(proveedores);
    return eliminado;
  }


  obtenerProductosPorProveedor(id) {
    const productosPath = path.join("src", "data", "producto.json");
    const productosData = fs.readFileSync(productosPath, "utf-8");
    const productos = JSON.parse(productosData);
    return productos.filter(prod => prod.proveedorId === Number(id));
  }

  obtenerCategoriasPorProveedor(proveedor) {
    const categoriasPath = path.join("src", "data", "categoria.json");
    const categoriasData = fs.readFileSync(categoriasPath, "utf-8");
    const categorias = JSON.parse(categoriasData);
    return categorias.filter(cat => proveedor.categorias.includes(cat.id));
  } 
  
  
  
obtenerPorCategoriaId(categoriaId) {
  const todosProveedores = this._leerProveedores();

  const categoriaNum = Number(categoriaId);


  const proveedoresCoincidentes = todosProveedores.filter(pr => {

    if (Array.isArray(pr.categorias)) {
      return pr.categorias.some(cat => Number(cat) === categoriaNum);
    }
    return false;
  });

  

  return proveedoresCoincidentes;
}



}

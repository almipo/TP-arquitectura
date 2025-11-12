export class ProductoModel {
  constructor(id, nombre, precio, stock, categoriaId, proveedorId, descripcion = "") {
    this.id = Number(id);
    this.nombre = nombre;
    this.precio = Number(precio);
    this.stock = Number(stock);
    this.categoriaId = Number(categoriaId);
    this.proveedorId = Number(proveedorId);
    this.descripcion = descripcion;
  }
}



export class ProveedorModel {
  constructor(id, nombre, apellido, dni, cuil, direccion, categorias = [], productos = []) {
    this.id = Number(id);
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.cuil = cuil;
    this.direccion = direccion;
    this.categorias = categorias;
    this.productos = productos;
  }
}
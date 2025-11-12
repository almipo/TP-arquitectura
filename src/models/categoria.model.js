export class CategoriaModel {
  constructor(id, nombre, descripcion = "") {
    this.id = Number(id);
    this.nombre = nombre;
    this.descripcion = descripcion;
  }


}

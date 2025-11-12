import fs from "fs";
import path from "path";

export class CategoriaDAO {
  constructor() {
    this.dataPath = path.join("src", "data", "categoria.json");
    this._asegurarArchivo();
  }

  _asegurarArchivo() {
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([]));
    }
  }

  _leerCategorias() {
    const data = fs.readFileSync(this.dataPath, "utf8");
    return JSON.parse(data);
  }

  _guardarCategorias(categorias) {
    fs.writeFileSync(this.dataPath, JSON.stringify(categorias, null, 2));
  }

  obtenerTodas() {
    return this._leerCategorias();
  }

  obtenerPorId(id) {
    const categorias = this._leerCategorias();
    return categorias.find(c => c.id === Number(id)) || null;
  }

  crear(categoria) {
    const categorias = this._leerCategorias();
    categorias.push(categoria);
    this._guardarCategorias(categorias);
    return categoria;
  }

  actualizar(id, categoriaActualizada) {
    const categorias = this._leerCategorias();
    const index = categorias.findIndex(c => c.id === Number(id));
    if (index === -1) return null;
    categorias[index] = categoriaActualizada;
    this._guardarCategorias(categorias);
    return categoriaActualizada;
  }

  eliminar(id) {
    const categorias = this._leerCategorias();
    const index = categorias.findIndex(c => c.id === Number(id));
    if (index === -1) return null;
    const [eliminada] = categorias.splice(index, 1);
    this._guardarCategorias(categorias);
    return eliminada;
  }
}

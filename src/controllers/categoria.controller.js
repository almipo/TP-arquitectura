// src/controllers/categoria.controller.js
import { CategoriaService } from "../service/categoria.service.js";

export class CategoriaController {
  constructor() {
    this.service = new CategoriaService();

    this.obtenerTodas = this.obtenerTodas.bind(this);
    this.obtenerPorId = this.obtenerPorId.bind(this);
    this.crear = this.crear.bind(this);
    this.actualizar = this.actualizar.bind(this);
    this.actualizarParcial = this.actualizarParcial.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.obtenerProductosPorCategoria = this.obtenerProductosPorCategoria.bind(this);
    this.obtenerProveedoresPorCategoria = this.obtenerProveedoresPorCategoria.bind(this);
  }

  _agregarLinks(categoria, req) {
    const baseUrl = `${req.protocol}://${req.get("host")}/api/categoria/${categoria.id}`;
    const collectionUrl = `${req.protocol}://${req.get("host")}/api/categoria`;

    return {
      ...categoria,
      _links: {
        self: { href: baseUrl, method: "GET" },
        update: { href: baseUrl, method: "PUT" },
        patch: { href: baseUrl, method: "PATCH" },
        delete: { href: baseUrl, method: "DELETE" },
        productos: { href: `${baseUrl}/producto`, method: "GET" },
        proveedores: { href: `${baseUrl}/proveedor`, method: "GET" },
      },
    };
  }



  async obtenerTodas(req, res) {
    try {
      const categorias = await this.service.obtenerTodas();
      const baseUrl = `${req.protocol}://${req.get("host")}/api/categoria`;
      res.json({
        count: categorias.length,
        categorias: categorias.map(c => this._agregarLinks(c, req)),
        _links: {
          self: { href: baseUrl, method: "GET" },
          create: { href: baseUrl, method: "POST" },
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await this.service.obtenerPorId(id);
      res.json(this._agregarLinks(categoria, req));
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async crear(req, res) {
    try {
      const nuevaCategoria = await this.service.crear(req.body);
      res.status(201).json({
        message: "Categoría creada correctamente",
        categoria: this._agregarLinks(nuevaCategoria, req),
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

async actualizar(req, res) {
  try {
    const { id } = req.params;
    const actualizada = await this.service.actualizar(id, req.body);

    res.json({
      message: "Categoría actualizada completamente",
      categoria: this._agregarLinks(actualizada, req),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


  async actualizarParcial(req, res) {
    try {
      const { id } = req.params;
      const actualizada = await this.service.actualizarParcial(id, req.body);
      res.json({
        message: "Categoría modificada parcialmente",
        categoria: this._agregarLinks(actualizada, req),
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminada = await this.service.eliminar(id);
      res.json({
        message: "Categoría eliminada correctamente",
        categoria: this._agregarLinks(eliminada, req),
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }


  async obtenerProductosPorCategoria(req, res) {
    try {
      const { id } = req.params;
      const productos = await this.service.obtenerProductosPorCategoria(id);
      res.json({
        categoriaId: id,
        productos: productos.map(p => ({
          ...p,
          _links: {
            self: { href: `${req.protocol}://${req.get("host")}/api/producto/${p.id}` },
            categoria: { href: `${req.protocol}://${req.get("host")}/api/categoria/${id}` },
            categorias: { href: `${req.protocol}://${req.get("host")}/api/categoria` },
          },
        })),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async obtenerProveedoresPorCategoria(req, res) {
    try {
      const { id } = req.params;
      const proveedores = await this.service.obtenerProveedoresPorCategoria(id);
      res.json({
        categoriaId: id,
        proveedores: proveedores.map(p => ({
          ...p,
          _links: {
            self: { href: `${req.protocol}://${req.get("host")}/api/proveedor/${p.id}` },
            categoria: { href: `${req.protocol}://${req.get("host")}/api/categoria/${id}` },
            categorias: { href: `${req.protocol}://${req.get("host")}/api/categoria` },
          },
        })),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

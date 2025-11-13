import { ProveedorService } from "../service/proveedor.service.js";


export class ProveedorController {
  constructor() {
    this.proveedorService = new ProveedorService();

   
    this.obtenerTodos = this.obtenerTodos.bind(this);
    this.obtenerPorId = this.obtenerPorId.bind(this);
    this.crear = this.crear.bind(this);
    this.actualizar = this.actualizar.bind(this);
    this.actualizarParcial = this.actualizarParcial.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.obtenerProductosPorProveedor = this.obtenerProductosPorProveedor.bind(this);
  }

  _agregarLinks(proveedor, req) {
    const baseUrl = `${req.protocol}://${req.get("host")}/api/proveedor/${proveedor.id}`;
    const collectionUrl = `${req.protocol}://${req.get("host")}/api/proveedor`;

    return {
      ...proveedor,
      _links: {
        self: { href: baseUrl },
        update: { href: baseUrl, method: "PUT" },
        delete: { href: baseUrl, method: "DELETE" },
        patch: { href: baseUrl, method: "PATCH" },
        getAll: { href: collectionUrl, method: "GET" },
        productos: { href: `${baseUrl}/producto`, method: "GET" },
      },
    };
  }

  async obtenerTodos(req, res) {
    try {
      const proveedores = await this.proveedorService.obtenerTodos();
      res.status(200).json({
        count: proveedores.length,
        proveedores: proveedores.map(p => this._agregarLinks(p, req)),
        _links: {
          self: { href: `${req.protocol}://${req.get("host")}/api/proveedor` },
          create: { href: `${req.protocol}://${req.get("host")}/api/proveedor`, method: "POST" },
        },
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener proveedores", error: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const proveedor = this.proveedorService.obtenerPorId(req.params.id);
      if (!proveedor) return res.status(404).json({ mensaje: "Proveedor no encontrado" });

      res.status(200).json(this._agregarLinks(proveedor, req));
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener proveedor", error: error.message });
    }
  }

  async crear(req, res) {
    try {
      const nuevoProveedor = this.proveedorService.crear(req.body);
      res.status(201).json({
        mensaje: "Proveedor creado correctamente",
        proveedor: this._agregarLinks(nuevoProveedor, req),
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al crear proveedor", error: error.message });
    }
  }

async actualizar(req, res) {
  try {
    const { id } = req.params;
    const actualizado = this.proveedorService.actualizar(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    res.status(200).json({
      mensaje: "Proveedor actualizado correctamente",
      proveedor: this._agregarLinks(actualizado, req),
    });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async actualizarParcial(req, res) {
  try {
    const { id } = req.params;
    const actualizado = this.proveedorService.actualizarParcial(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    res.status(200).json({
      mensaje: "Proveedor actualizado parcialmente",
      proveedor: this._agregarLinks(actualizado, req),
    });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}


  async eliminar(req, res) {
    try {
      const eliminado = this.proveedorService.eliminar(req.params.id);
      if (!eliminado) return res.status(404).json({ mensaje: "Proveedor no encontrado" });

      res.status(200).json({
        mensaje: "Proveedor eliminado correctamente",
        proveedor: this._agregarLinks(eliminado, req),
        _links: {
          all: { href: `${req.protocol}://${req.get("host")}/api/proveedor`, method: "GET" },
          create: { href: `${req.protocol}://${req.get("host")}/api/proveedor`, method: "POST" },
        },
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al eliminar proveedor", error: error.message });
    }
  }

  async obtenerProductosPorProveedor(req, res) {
    try {
      const proveedor = this.proveedorService.obtenerPorId(req.params.id);
      if (!proveedor) return res.status(404).json({ mensaje: "Proveedor no encontrado" });

      const productos = this.proveedorService.obtenerProductos(req.params.id);
      res.status(200).json({
        mensaje: "Productos del proveedor obtenidos correctamente",

        cantidadProductos: productos.length,
        productos,
        _links: {
          self: { href: `${req.protocol}://${req.get("host")}/api/proveedor/${req.params.id}/producto`, method: "GET" },
          proveedor: { href: `${req.protocol}://${req.get("host")}/api/proveedor/${req.params.id}`, method: "GET" },
          allProveedores: { href: `${req.protocol}://${req.get("host")}/api/proveedor`, method: "GET" },
          productos: { href: `${req.protocol}://${req.get("host")}/api/producto`, method: "GET" },
        },
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener productos del proveedor", error: error.message });
    }
  }
}

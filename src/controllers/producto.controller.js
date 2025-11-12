// src/controllers/producto.controller.js
import { ProductoService } from "../service/producto.service.js";



export class ProductoController {
  constructor() {
    this.service = new ProductoService();

    this.obtenerTodos = this.obtenerTodos.bind(this);
    this.obtenerPorId = this.obtenerPorId.bind(this);
    this.crear = this.crear.bind(this);
    this.actualizar = this.actualizar.bind(this);
    this.actualizarParcial = this.actualizarParcial.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.obtenerCategoriaDeProducto = this.obtenerCategoriaDeProducto.bind(this);
    this.obtenerProveedorDeProducto = this.obtenerProveedorDeProducto.bind(this);
  }

  _agregarLinks(producto, req) {
    const baseUrl = `${req.protocol}://${req.get("host")}/api/producto/${producto.id}`;


    return {
      ...producto,
      _links: {
        self: { href: baseUrl, method: "GET" },
        update: { href: baseUrl, method: "PUT" },
        patch: { href: baseUrl, method: "PATCH" },
        delete: { href: baseUrl, method: "DELETE" },
        categoria: { href: `${baseUrl}/categoria`, method: "GET" },
        proveedor: { href: `${baseUrl}/proveedor`, method: "GET" },
      },
    };
  }

  async obtenerTodos(req, res) {
    try {
      const productos = await this.service.obtenerTodos();
      const baseUrl = `${req.protocol}://${req.get("host")}/api/producto`;

      res.status(200).json({
        count: productos.length,
        productos: productos.map(p => this._agregarLinks(p, req)),
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
    const producto = await this.service.obtenerPorId(req.params.id);

    const response = {
      links: {
        ...this._agregarLinks(producto, req),
       
        getall: { href: `${req.protocol}://${req.get("host")}/api/producto`, method: "GET" },
      },
    };

    res.status(200).json(response);

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

  async crear(req, res) {
    try {
      const nuevo = await this.service.crear(req.body);
      const response = {
      _links:{ ...this._agregarLinks(nuevo, req),
               
        productos: { href: `${req.protocol}://${req.get("host")}/api/producto`, method: "GET" },
        message: "Producto creado correctamente",
      },
    };

      res.status(201).json(response, {message: "Producto creado correctamente"});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async actualizar(req, res) {
  try {
    const camposPermitidos = [
      "nombre",
      "precio",
      "stock",
      "categoriaId",
      "proveedorId",
      "descripcion",
    ];

    const faltantes = camposPermitidos.filter(campo => !(campo in req.body));

    if (faltantes.length > 0) {
      return res.status(400).json({
        message: `Faltan campos obligatorios para actualización completa: ${faltantes.join(", ")}`,
      });
    }

    const extras = Object.keys(req.body).filter(
      campo => !camposPermitidos.includes(campo)
    );

    if (extras.length > 0) {
      return res.status(400).json({
        message: `Campos no permitidos en la actualización: ${extras.join(", ")}`,
      });
    }

   
    const actualizado = await this.service.actualizar(req.params.id, req.body);

    if (!actualizado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json({
      message: "Producto actualizado completamente",
      producto: this._agregarLinks(actualizado, req),
    });

  } catch (error) {
    console.error("Error en PUT /producto/:id:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


async actualizarParcial(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const CAMPOS_VALIDOS = [
      "nombre",
      "precio",
      "stock",
      "categoriaId",
      "proveedorId",
      "descripcion",
    ];
    const camposInvalidos = Object.keys(data).filter(
      key => !CAMPOS_VALIDOS.includes(key)
    );

    if (camposInvalidos.length > 0) {
      return res.status(400).json({
        message: `Campos inválidos: ${camposInvalidos.join(", ")}`,
      });
    }
    const dataFiltrada = Object.keys(data)
      .filter(key => CAMPOS_VALIDOS.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

   
    const actualizado = await this.service.actualizarParcial(id, dataFiltrada);

 
    res.status(200).json({
      message: "Producto actualizado correctamente",
      producto: actualizado,
      _links: {
        ...this._agregarLinks(actualizado, req),
        productos: {
          href: `${req.protocol}://${req.get("host")}/api/producto`,
          method: "GET",
        },
      },
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

  

async eliminar(req, res) {
  try {
    const eliminado = await this.service.eliminar(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Producto eliminado correctamente",
      _links: {
        productos: { 
          href: `${req.protocol}://${req.get("host")}/api/producto`, 
          method: "GET" 
        },

        categorias: { 
          href: `${req.protocol}://${req.get("host")}/api/categoria`, 
          method: "GET" 
        }
      }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


  async obtenerCategoriaDeProducto(req, res) {
    try {
      const { producto, categoria } = await this.service.obtenerCategoria(req.params.id);
  if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
      res.json({
        
        categoria: categoria
          ? {
              ...categoria,
              _links: {
                self: { href: `${req.protocol}://${req.get("host")}/api/categoria/${categoria.id}`, method: "GET" },
                producto: { href: `${req.protocol}://${req.get("host")}/api/producto/${producto.id}`, method: "GET" },
            }
          }
          : null,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async obtenerProveedorDeProducto(req, res) {
    try {
      const { producto, proveedor } = await this.service.obtenerProveedor(req.params.id);
       if (!proveedor) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
      res.json({
        proveedor: proveedor
          ? {
              ...proveedor,
              _links: {
                self: { href: `${req.protocol}://${req.get("host")}/api/proveedor/${proveedor.id}`, method: "GET" },
                producto: { href: `${req.protocol}://${req.get("host")}/api/producto/${producto.id}`, method: "GET" },
                categorias: { href: `${req.protocol}://${req.get("host")}/api/categoria`, method: "GET" },
                productos: { href: `${req.protocol}://${req.get("host")}/api/producto`, method: "GET" },
              },
            }
          : null,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

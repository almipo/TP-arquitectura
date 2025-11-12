// src/routes/producto.route.js
import { Router } from "express";
import { ProductoController } from "../controllers/producto.controller.js";

const router = Router();
const controller = new ProductoController();

router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.get("/:id/categoria", controller.obtenerCategoriaDeProducto);
router.get("/:id/proveedor", controller.obtenerProveedorDeProducto);

router.post("/", controller.crear);

router.put("/:id", controller.actualizar);

router.patch("/:id", controller.actualizarParcial);

router.delete("/:id", controller.eliminar);

export default router;

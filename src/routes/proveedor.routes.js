import { Router } from "express";
import { ProveedorController } from "../controllers/proveedor.controller.js";

const router = Router();
const controller = new ProveedorController();

router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.get("/:id/producto", controller.obtenerProductosPorProveedor);

router.post("/", controller.crear);

router.put("/:id", controller.actualizar);

router.patch("/:id", controller.actualizarParcial);

router.delete("/:id", controller.eliminar);

export default router;

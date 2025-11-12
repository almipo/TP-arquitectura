import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller.js';

const router = Router();
const categoriaController = new CategoriaController();

router.get('/', categoriaController.obtenerTodas);
router.get('/:id', categoriaController.obtenerPorId);
router.get('/:id/producto', categoriaController.obtenerProductosPorCategoria);
router.get('/:id/proveedor', categoriaController.obtenerProveedoresPorCategoria);

router.post('/', categoriaController.crear);

router.put('/:id', categoriaController.actualizar);

router.patch('/:id', categoriaController.actualizarParcial);

router.delete('/:id', categoriaController.eliminar);

export default router;

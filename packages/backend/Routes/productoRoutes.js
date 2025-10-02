import { ProductoController } from "../Controllers/ProductoController.js";
import express from "express";
import { productoErrorHandler } from "../Middlewares/productoMiddleware.js";
import { loggerMiddleware } from "../Middlewares/loggerMiddleware.js";

export default function productoRoutes(getController) {
    const router = express.Router();
    router.use(loggerMiddleware);

    // http://localhost:8000/vendedor/:id/productos?titulo=algo&categoria=otraCosa&descripcion=masCosas&precioMin=100&precioMax=500&sort=precioAsc
    router.get('/vendedor/:id/productos', async (req, res, next) => {
        try {
          await getController(ProductoController).obtenerProductosPorVendedor(req, res);
        } catch (err) {
          next(err);
        }
    });

    router.use(productoErrorHandler);

    return router;

}
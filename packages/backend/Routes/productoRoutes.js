import { ProductoController } from "../Controllers/ProductoController.js";
import express from "express";
import { productoErrorHandler } from "../Middlewares/productoMiddleware.js";
import { loggerMiddleware } from "../Middlewares/loggerMiddleware.js";

export default function productoRoutes(getController) {
    const router = express.Router();
    router.use(loggerMiddleware);

    // NUEVA RUTAAAAAA, endpoint para carrusel de Home (1 producto más vendido por vendedor)
    router.get('/productos/destacados', async (req, res, next) => {
        try {
          await getController(ProductoController).obtenerProductosDestacados(req, res);
        } catch (err) {
          next(err);
        }
    });

    // RUTA EXISTENTE, http://localhost:8000/vendedor/:id/productos...
    router.get('/vendedor/:id/productos', async (req, res, next) => {
        try {
          await getController(ProductoController).obtenerProductosPorVendedor(req, res);
        } catch (err) {
          next(err);
        }
    });

    router.get('/productos/:id', async (req, res, next) => {
        try {
          await getController(ProductoController).obtenerProductoPorId(req, res); 
        } catch (err) {
          next(err);
        }
    });

    router.use(productoErrorHandler);

    return router;
}
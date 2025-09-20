import { ProductoController } from "../Controllers/ProductoController.js";
import express from "express";
import { productoErrorHandler } from "../Middlewares/productoMiddleware.js";
import { loggerMiddleware } from "../Middlewares/loggerMiddleware.js";

export default function productoRoutes(getController) {
    const router = express.Router();
    router.use(loggerMiddleware);

    router.post('/producto', async (req, res, next) => {
        try {
          await getController(ProductoController).crearproducto(req, res);
        } catch (err) {
          next(err);
        }
    });

    router.use(productoErrorHandler);

    return router;

}
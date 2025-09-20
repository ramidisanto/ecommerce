import { PedidoController } from "../Controllers/PedidoController.js";
import express from "express";
import { pedidoErrorHandler } from "../Middlewares/pedidoMiddleware.js";
import { loggerMiddleware } from "../Middlewares/loggerMiddleware.js";

export default function pedidoRoutes(getController) {
    const router = express.Router();
    router.use(loggerMiddleware);

    router.post('/pedido', async (req, res, next) => {
        try {
          await getController(PedidoController).crearPedido(req, res);
        } catch (err) {
          next(err);
        }
    });

    router.use(pedidoErrorHandler);

    return router;
}
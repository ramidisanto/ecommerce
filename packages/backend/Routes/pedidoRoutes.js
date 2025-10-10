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

    router.delete('/pedido/:pedidoId', async (req, res, next) => {
        try {
          await getController(PedidoController).cancelarPedido(req, res);
        } catch (err) {
          next(err);
        } 
    });
    
    router.get('/usuarios/:id/pedidos', async (req, res, next) => {
        try {
          await getController(PedidoController).obtenerHistorial(req, res);
        } catch (err) {
          next(err);
        }
    });

    router.patch('/pedido/:id/enviado', async (req, res, next) => {
        try {
          await getController(PedidoController).marcarPedidoEnviado(req, res);
        } catch (err) {
          next(err);
        }
    });

    router.use(pedidoErrorHandler);

    return router;
}
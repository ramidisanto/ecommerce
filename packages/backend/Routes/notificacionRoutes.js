import { NotificacionController } from "../Controllers/NotificacionController.js";
import express from "express";
import { notificacionErrorHandler } from "../Middlewares/notificacionMiddleware.js";
import { loggerMiddleware } from "../Middlewares/loggerMiddleware.js";

export default function notificacionRoutes(getController) {
    const router = express.Router();
    router.use(loggerMiddleware);

     //RUTAS DE NOTIFICACIONES
    // GET /usuarios/:id/notificaciones?leida=true|false
    router.get('/usuarios/:id/notificaciones', async (req, res, next) => {
    try {
      await getController(NotificacionController).obtenerNotificacionesDeUsuario(req, res);
    } catch (err) {
      next(err);
    }
    });

    router.patch('/notificacion/:id', async (req, res, next) => {
    try {
      await getController(NotificacionController).marcarNotificacionLeida(req, res);
    } catch (err) {
      next(err);
    }
    });

    router.use(notificacionErrorHandler);

    return router;

}
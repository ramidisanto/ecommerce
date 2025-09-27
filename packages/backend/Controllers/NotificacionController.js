import { z } from "zod";
import { NoExisteException } from "../Excepciones/NoExisteException.js";
import { UsuarioService } from "../Services/UsuarioService.js";
import { NotificacionService } from "../Services/NotificacionService.js";
import mongoose from "mongoose";


export class NotificacionController{
    notificacionService
    usuarioService

    constructor(notificacionService, usuarioService){
        this.notificacionService = notificacionService;
        this.usuarioService = usuarioService;
    }

/////// GET => Obtener notificaciones de un usuario
    async obtenerNotificacionesDeUsuario(req, res){

        const resultLeida = leidaTransform.safeParse(req.query.leida);

        if (resultLeida.error) {
            res.status(400).json(resultLeida.error.issues);
            return;
        }

        const id = req.params.id;
        const leida = resultLeida.data;

        if ( !await this.usuarioService.exists(id)) { 
            throw new NoExisteException(id, "usuario");
        }

        const notificaciones = await this.notificacionService.obtenerNotificacionesDeUsuario(id, leida);

        if (notificaciones === null) {
            return res.status(204).send();
        }

        res.status(200).json(notificaciones.map(aNotificacionRest));

    }

/////// PATCH => Marcar notificacion como leida
    async marcarNotificacionLeida(req, res){

        const id = req.params.id;

        const notificacion = await this.notificacionService.findById(id);

        if (!notificacion) {
            throw new NoExisteException(id, "notificacion");
        }

        const notificacionLeida = await this.notificacionService.marcarNotificacionComoLeida(notificacion);

        res.status(200).json(aNotificacionRest(notificacionLeida));

    }

}    

const aNotificacionRest = (datosDeLaNotificacion) => {
    return {
    id: datosDeLaNotificacion.id,
    usuarioDestino: datosDeLaNotificacion.usuarioDestino,
    mensaje: datosDeLaNotificacion.mensaje,
    fechaAlta: datosDeLaNotificacion.fechaAlta,
    leida: datosDeLaNotificacion.leida,
    fechaLeida: datosDeLaNotificacion.fechaLeida
    }
};




const leidaTransform = z.string().transform((val, ctx) => {
    if (val === "true") return true;
    if (val === "false") return false;
    ctx.addIssue({
        code: "INVALID_TYPE",
        message: "leida must be a boolean ('true' or 'false')",
    });
    return z.NEVER;
});

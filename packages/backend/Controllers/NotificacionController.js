import { z } from "zod";
import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";
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

        // const resultId = objectId.safeParse(req.params.id); 
        const resultId = req.params.id;

        const resultLeida = leidaTransform.safeParse(req.query.leida);

        if (resultLeida.error) {
            res.status(400).json(resultLeida.error.issues);
            return;
        }

        const leida = resultLeida.data;

        if ( !await this.usuarioService.exists(resultId)) { 
            throw new NoExisteIdException(resultId, "usuario");
        }

        let notificaciones;

        if (leida !== undefined){
            notificaciones = await this.notificacionService.obtenerNotificacionesDeUsuarioLeidas(resultId, leida);
        }else{
            notificaciones = await this.notificacionService.obtenerNotificacionesDeUsuario(resultId);
        }

        if (notificaciones === null || notificaciones.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json(notificaciones.map(aNotificacionRest));

    }

/////// PATCH => Marcar notificacion como leida
    async marcarNotificacionLeida(req, res){

         const resultId = objectId.safeParse(req.params.id); 

        if (resultId.error) {
            res.status(400).json(resultId.error.issues);
            return;
        }

        const notificacion = await this.notificacionService.findById(resultId.data);

        if (!notificacion) {
            throw new NoExisteIdException(resultId.data, "notificacion");
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




const leidaTransform = z
  .string()
  .transform((val, ctx) => {
    if (val === "true") return true;
    if (val === "false") return false;
    ctx.addIssue({
      code: "invalid_type",
      message: "El parámetro 'leida' debe ser booleano",
    });
    return z.NEVER;
  })
  .optional();

  


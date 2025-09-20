import { z } from "zod";
import { NoExisteException } from "../Excepciones/NoExisteException.js";


export class NotificacionController{
    
    notificacionService

    constructor(notificacionService, usuarioService){
        this.notificacionService = notificacionService;
        this.usuarioService = usuarioService;
    }

/////// GET => Obtener notificaciones de un usuario
    async obtenerNotificacionesDeUsuario(req, res){

        const resultId = idTransform.safeParse(req.params.id);

        if (resultId.error) {
            res.status(400).json(resultId.error.issues);
            return;
        }

        const resultLeida = leidaTransform.safeParse(leida);

        if (resultLeida.error) {
            res.status(400).json(resultLeida.error.issues);
            return;
        }

        const id = resultId.data;
        const leida = resultLeida.data;

        const usuario = await this.usuarioService.findById(id); // TODO: HACER USUARIO SERVICE Y METODO FIND BY ID

        if (!usuario) {
            throw new NoExisteException(id, "usuario");
        }

        const notificaciones = await this.notificacionService.obtenerNotificacionesDeUsuario(usuario, leida);

        if (notificaciones === null) {
            return res.status(204).send();
        }

        res.status(200).json(notificaciones.map(aNotificacionRest));

    }

/////// PATCH => Marcar notificacion como leida
    async marcarNotificacionLeida(req, res){
        
        const resultId = idTransform.safeParse(req.params.id);

        if (resultId.error) {
            res.status(400).json(resultId.error.issues);
            return;
        }

        const id = resultId.data;

        const notificacion = await this.notificacionService.findById(id);

        if (!notificacion) {
            throw new NoExisteException(id, "notificacion");
        }

        const notificacionLeida = await this.notificacionService.marcarNotificacionLeida(notificacion);
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

const idTransform = z.string().transform((val, ctx) => {
    const num = Number(val);
    if (isNaN(num)) {
    ctx.addIssue({
        code: "INVALID_ID",
        message: "id must be a number",
    });
        return z.NEVER;
    }
        return num;
});


const leidaTransform = z.string().transform((val, ctx) => {
    if (val === "true") return true;
    if (val === "false") return false;
    ctx.addIssue({
        code: "INVALID_TYPE",
        message: "leida must be a boolean ('true' or 'false')",
    });
    return z.NEVER;
});

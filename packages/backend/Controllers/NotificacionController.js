
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


export class NotificacionController{
    
    notificacionService

    constructor(notificacionService){
        this.notificacionService = notificacionService;
    }

    async obtenerNotificacionesDeUsuario(req, res){
        const usuario = req.param.id;
        const leida = req.query.leida;
        const notificaciones = await this.notificacionService.obtenerNotificacionesDeUsuario(usuario, leida);
        res.status(200).json(notificaciones.map(aNotificacionRest));
    }

    async marcarNotificacionLeida(req, res){
        try{
            //ID NOTIFICACION
            const id = req.param.id;
            const notificacionLeida = await this.notificacionService.marcarNotificacionLeida(id);
            res.status(200).json(aNotificacionRest(notificacionLeida));
        }
        catch(error){
            console.error(error);
            res.status(500).json({message: 'Error al marcar la notificacion como leida'});
        }
    }

}    

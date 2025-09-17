import { NotificacionRepository } from "../Repositories/NotificacionRepository.js";

export class NotificacionService{

    notificacionRepository;
    
    constructor(notificacionRepository){
        this.notificacionRepository = notificacionRepository;
    }

    //Operaciones CRUD SOBRE NOTIFICACIONES
    
    //CREATE => Se ocupa el factory notificacionFactory

    //READ => Obtener notificaciones de un usuario
    async obtenerNotificacionesDeUsuario(usuario, leida){
        const notificaciones = await this.notificacionRepository.obtenerNotificacionesDeUsuario(usuario, leida);
        return notificaciones;
    }

    //UPDATE => Marcar notificacion como leida
    marcarNotificacionComoLeida(notificacionId){
        notificacionRepository.marcarNotificacionComoLeida(notificacionId);
    }

    //DELETE => Eliminar notificacion
    eliminarNotificacion(notificacionId){
        return this.notificacionRepository.eliminarNotificacion(notificacionId);
    }
}
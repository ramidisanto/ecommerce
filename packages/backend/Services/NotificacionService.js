import { NotificacionRepository } from "../Repositories/NotificacionRepository.js";
import { Notificacion } from "../Domain/Notificacion.js";

export class NotificacionService{

    notificacionRepository;
    
    constructor(notificacionRepository){
        this.notificacionRepository = notificacionRepository;
    }

    //Operaciones CRUD SOBRE NOTIFICACIONES
    
    //CREATE => Se ocupa el factory notificacionFactory

    //READ => Obtener notificaciones de un usuario
    async obtenerNotificacionesDeUsuario(id, leida){
        const notificaciones = await this.notificacionRepository.obtenerNotificacionesDeUsuario(id, leida);
        return notificaciones;
    }

    //UPDATE => Marcar notificacion como leida
    async marcarNotificacionComoLeida(notificacion){
        notificacion.marcarComoLeida();
        const notificacionActualizada = await this.notificacionRepository.save(notificacion); // TODO: HACER LOS METODOS DE LOS REPOSITORIOS
        return notificacionActualizada;
    }

    async enviarNotificacion(notificacion){
        await this.notificacionRepository.save(notificacion);
        return notificacion;
    }

    async findById(id) {
        const notificacion = await this.notificacionRepository.findById(id);
        return notificacion;
    }

}
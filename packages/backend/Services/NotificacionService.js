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
    async marcarNotificacionComoLeida(notificacion){
        notificacion.marcarComoLeida();
        await this.notificacionRepository.save(notificacion); // TODO: HACER LOS METODOS DE LOS REPOSITORIOS
        return notificacion;
    }

    async enviarNotificacion(notificacion){
        await this.notificacionRepository.save(notificacion);
        return notificacion;
    }

    async findById(id) {
        return await this.notificacionRepository.findById(id);
    }

}
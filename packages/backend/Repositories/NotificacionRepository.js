import { Notificacion } from "../Domain/Notificacion.js";
import { NotificacionModel } from "../Schemas/NotificacionSchema.js";
//import { UsarioModel } from "../Schemas/UsuarioSchema.js"; Hay que hacer

export class NotificacionRepository{
    
    constructor(){
        this.model = NotificacionModel;
    }

    async obtenerNotificacionesDeUsuarioLeidas(usuario, leida) { 
        return await this.model.find({ 
            usuarioDestino: usuario, 
            leida: leida 
        });
    }

    async obtenerNotificacionesDeUsuario(usuario) {
        return await this.model.find({ 
            usuarioDestino: usuario
        });
    }

    async save(notificacion) {
    if (notificacion.id || notificacion._id) {
        // Si tiene id, actualiza la notificacion existente
        const notificacionActualizada = await this.model.findByIdAndUpdate(
            notificacion.id || notificacion._id,
            notificacion,
            { 
                new: true, 
                runValidators: true
            } // retorna el nuevo y runValidators asegura que las validaciones del schema se apliquen
        );

        // ACA tenemos que inicializar las cosas que no persistimos en la base??? 
        return notificacionActualizada;

    } else {
        // Si no tiene id, crea una nueva notificacion
        const nuevaNotificacion = new this.model(notificacion); //estamos haciendo un nuevo documento instanciado con el esquema q definimos
        const notificacionGuardada = await nuevaNotificacion.save();
        return notificacionGuardada;
        }
    }

    async findById(id) {
        return await this.model.findById(id);
    }


}
import { Notificacion } from "../Domain/Notificacion.js";
//import {ObjectId} from "mongodb";

export class NotificacionRepository{
    /*
    constructor(db){
        this.collection = db.collection('notificaciones');
    }
    
    // MAPPERS DE NOTIFICACION
    aNotificacionDB(notificacion){
        const notificacionDB = {
            ...notificacion,
        };
        delete notificacion.id;
        return notificacionDB;
    }

    deNotificacionDB(notificacionDB){
        const notificacion = new Notificacion();
        Object.assign(notificacion, {
            id: notificacionDB._id.toString(),
            usuarioDestino: notificacionDB.usuario,
            mensaje: notificacionDB.mensaje,
            fechaAlta: notificacionDB.fechaAlta,
            leida: notificacionDB.leida,
            fechaLeida: notificacionDB.fechaLeida,
        });

        return notificacion;
    }

    //FUNCIONES PARA OBTENER Y GUARDAR NOTIFICACIONES
    async obtenerNotificacionesDeUsuario(usuario, leida) {
        const notificaciones = await this.collection.find({ usuario: usuario, leida: leida }).toArray();
        return notificaciones.map(n => this.deNotificacionDB(n));
    }

    async marcarNotificacionComoLeida(notificacionId){
        await this.collection.updateOne(
            { _id: new ObjectId(notificacionId) },
            { $set: { leida: true, fechaLeida: new Date() } }
        );
    }

    async guardarNotificacion(notificacion){
        const notificacionDB = this.aNotificacionDB(notificacion);
        const result = await this.collection.insertOne(notificacionDB);
        notificacion.id = result.insertedId.toString();
        return notificacion;
    } */


}
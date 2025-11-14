import mongoose from 'mongoose';
import { Notificacion } from '../Domain/Notificacion.js';

const NotificacionSchema = new mongoose.Schema({
    usuarioDestino: {
        //Por referencia
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "Usuario",
        required: true
    },
    mensaje: {
        type: String,
        required: true,
    },
    fechaAlta: {
        type: Date,
        required: true,
    },
    leida: {
        type: Boolean,
        required: true,
        default: false //Nostros ya hacemos false cuando se crea la notificacion. Decidir donde ponerlo el false
    },
    fechaLeida: {
        type: Date,
        required: false, //No se si será necesario guardar la fecha de leida
    },
}, {
    timestamps: false,
    collection: 'notificaciones'
});

NotificacionSchema.pre(/^find/, function(next) {
    this.populate('usuarioDestino');
    next();
});

NotificacionSchema.loadClass(Notificacion);
export const NotificacionModel = mongoose.model('Notificacion', NotificacionSchema);
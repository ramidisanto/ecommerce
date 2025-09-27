import mongoose from 'mongoose';
import { Notificacion } from './Domain/notificacion.js';

const NotificacionSchema = new mongoose.Schema({
    usuarioDestino: {
        //Por referencia
        type: mongoose.Schema.Types.ObjectId,
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
        required: true, //No se si será necesario guardar la fecha de leida
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
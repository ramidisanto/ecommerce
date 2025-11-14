import mongoose from 'mongoose';
import { Usuario } from '../Domain/Usuario.js';

const usuarioSchema = new mongoose.Schema({
    _id: {
    type: String,
    required: true
    },
  nombre: { 
        type: String,
        required: true
    },
  email: {
        type: String,
        required: true
    },
  telefono: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['COMPRADOR', 'VENDEDOR', 'ADMINISTRADOR']
    },
    fechaAlta: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    collection: 'usuarios'
});

usuarioSchema.loadClass(Usuario);
export const UsuarioModel = mongoose.model('Usuario', usuarioSchema);
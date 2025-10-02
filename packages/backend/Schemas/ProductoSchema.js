import mongoose from "mongoose";
import { Producto } from "../Domain/Pedido.js";

const ProductoSchema = new mongoose.Schema({
    titulo: {
        type: String,   
        required: true,
        minlength: 3,
        maxlength: 50
    },  
    descripcion: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    }, 
    vendedorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    categorias: [{
        type: String,
        required: true
    }], 
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,   
        required: true,
        min: 0
    },
    moneda: {
        type: String,
        required: true,
        enum: ['ARS','USD','EUR']
    },
    fechaCreacion: {
        type: Date,
        required: true,
        default: Date.now
    },  
    fotos: [{
        type: String,
        required: false
    }],
    activo: {
        type: Boolean,  
        required: true,
        default: true
    }
}, {
    timestamps: false,
    collection: 'productos'
});

ProductoSchema.pre(/^find/, function(next) {
    this.populate('vendedorId');
    next();
});

ProductoSchema.loadClass(Producto);
export const ProductoModel = mongoose.model('Producto', ProductoSchema);

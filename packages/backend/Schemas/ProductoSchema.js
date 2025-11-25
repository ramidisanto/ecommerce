import mongoose from "mongoose";
import { Producto } from "../Domain/Producto.js";

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
        type: String,
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
        enum: ['ARS', 'USD', 'EUR']
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
    },
    ventas: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: false,
    collection: 'productos'
});

// Índices para optimizar consultas
ProductoSchema.index({ vendedorId: 1 }); // Búsqueda de productos por vendedor
ProductoSchema.index({ ventas: -1 }); // Ordenamiento por ventas en agregaciones
ProductoSchema.index({ vendedorId: 1, ventas: -1 }); // Índice compuesto para obtenerMasVendidoPorVendedor

ProductoSchema.loadClass(Producto);
export const ProductoModel = mongoose.model('Producto', ProductoSchema);

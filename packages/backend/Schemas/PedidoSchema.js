import mongoose from "mongoose";
import { Pedido } from "../Domain/Pedido.js";
import { DireccionEntrega } from "../Domain/DireccionEntrega.js";
import { ItemPedido } from "../Domain/ItemPedido.js";

const DireccionEntregaSchema = new mongoose.Schema({
    calle: { type: String, required: true },
    altura: { type: Number, required: true },
    piso: { type: Number },
    departamento: { type: String },
    codigoPostal: { type: Number, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    pais: { type: String, required: true },
    lat: { type: Number },
    lon: { type: Number }
}, { _id: false });

DireccionEntregaSchema.loadClass(DireccionEntrega);

const ItemPedidoSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precioUnitario: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

ItemPedidoSchema.loadClass(ItemPedido);


const PedidoSchema = new mongoose.Schema({
    comprador: {
        type: String,
        ref: "Usuario",
        required: true
    },
    items: {
        type: [ItemPedidoSchema],
        required: true
    },

    moneda: {
        type: String,
        required: true,
        enum: ['ARS', 'USD', 'EUR']
    },
    direccionEntrega: {
        type: DireccionEntregaSchema,
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: ['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO'],
        default: 'PENDIENTE'
    },
    fechaCreacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    historialEstados: [{
        fecha: {
            type: Date,
            required: true,
            default: Date.now
        },
        estado: {
            type: String,
            required: true,
            enum: ['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO']
        },

        usuario: {

            type: String,
            ref: "Usuario",
            required: true
        },
        motivo: {
            type: String,
            required: false,
            maxlength: 200
        }
    }]
}, {
    timestamps: false,
    collection: 'pedidos'
});

// Índices para optimizar consultas
PedidoSchema.index({ comprador: 1 }); // Búsqueda de pedidos por comprador
PedidoSchema.index({ 'items.producto': 1 }); // Búsqueda de pedidos por producto (para ventas)
PedidoSchema.index({ estado: 1 }); // Filtrado por estado
PedidoSchema.index({ comprador: 1, fechaCreacion: -1 }); // Historial ordenado por fecha

PedidoSchema.loadClass(Pedido);
export const PedidoModel = mongoose.model('Pedido', PedidoSchema);
import mongoose from "mongoose";
import { Pedido } from "../Domain/Pedido.js";
import { DireccionEntrega } from "../Domain/DireccionEntrega.js";
import { ItemPedido } from "../Domain/ItemPedido.js";

const DireccionEntregaSchema = new mongoose.Schema({
  calle: { type: String, required: true },
  altura: { type: Number, required: true },
  piso: { type: Number },
  departamento: { type: String },
  codigoPostal: { type: Number, required: true},
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
}}, { _id: false }); 

ItemPedidoSchema.loadClass(ItemPedido);


const PedidoSchema = new mongoose.Schema({
    comprador: {
        // type: mongoose.Schema.Types.ObjectId,       
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
        enum: ['ARS','USD','EUR']
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
        // no tendrÃ­a sentido meter el pedido en el historial de cambios de estado
        usuario: {
           // type: mongoose.Schema.Types.ObjectId,
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

PedidoSchema.pre(/^find/, function(next) {
    this.populate('comprador').populate('historialEstados.usuario').populate('items.producto').populate('items.producto.vendedorId');
    next();
});
PedidoSchema.loadClass(Pedido);
export const PedidoModel = mongoose.model('Pedido', PedidoSchema);
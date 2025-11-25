import {ObjectId} from "mongodb";
import { Pedido } from "../Domain/Pedido.js";
import { PedidoModel } from "../Schemas/PedidoSchema.js";
import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";

export class PedidoRepository {
    constructor() {
        this.model = PedidoModel;
    }
    async crearPedido(pedido){
        const pedidoNuevo = new this.model(pedido);
        const pedidoGuardado = await pedidoNuevo.save();
        return pedidoGuardado;
    }

    async actualizarPedido(pedido) {
    const pedidoData = {
        _id: pedido._id,
        estado: pedido.estado,
        comprador: pedido.comprador,
        items: pedido.items.map(i => ({
            producto: i.producto._id || i.producto,
            cantidad: i.cantidad,
            precioUnitario: i.precioUnitario
        })),
        moneda: pedido.moneda,
        direccionEntrega: pedido.direccionEntrega,
        fechaCreacion: pedido.fechaCreacion,
        historialEstados: pedido.historialEstados,
    };

    await this.model.findByIdAndUpdate(
        pedido._id,
        pedidoData,
        { new: true, runValidators: true }
    );

}

    async obtenerPedidosPorUsuarioId(usuarioId) {
        
        const pedidos = await this.model.find({ comprador: usuarioId }).populate('items.producto');
        return pedidos;
    }

   

    async obtenerPedidoPorId(pedidoId) {
        const pedido = await this.model.findById(pedidoId).populate('items.producto', 'comprador');
        return pedido;
    }

    async obtenerPedidosPorVendedorId(IdsDeProductos) {

        const pedidos = await this.model.find({
            'items': {
                $elemMatch: {
                    'producto': { $in: IdsDeProductos }
                }
            }
        }).populate('comprador').populate('items.producto'); 

        
        return pedidos;
    }


}
  
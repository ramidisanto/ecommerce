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
            producto: i.producto._id || i.producto, // asegúrate de que sea un ObjectId
            cantidad: i.cantidad,
            precioUnitario: i.precioUnitario
        })),
        moneda: pedido.moneda,
        direccionEntrega: pedido.direccionEntrega,
        fechaCreacion: pedido.fechaCreacion,
        historialEstados: pedido.historialEstados,
    };

    let pedidoActualizado = await this.model.findByIdAndUpdate(
        pedido._id,
        pedidoData,
        { new: true, runValidators: true }
    );

    pedidoActualizado = await this.obtenerProductosDePedido(pedidoActualizado);
    return pedidoActualizado;
}

    async obtenerPedidosPorUsuarioId(usuarioId) {
        return await this.model.find({ comprador: usuarioId });
    }

    async obtenerProductosDePedido(pedido) {
        await pedido.populate('items.producto');
        return pedido;
    }

    async obtenerPedidoPorId(pedidoId) {
        const pedido = await this.model.findById(pedidoId);
        return await this.obtenerProductosDePedido(pedido);
    }

    async obtenerPedidosPorVendedorId(IdsDeProductos) {

        const pedidos = await this.model.find({
            'items': {
                $elemMatch: {
                    'producto': { $in: IdsDeProductos }
                }
            }
        })
        .populate('items.producto'); 

        console.log('Pedidos encontrados para el vendedor:', pedidos);
        return pedidos;
    }


}
  
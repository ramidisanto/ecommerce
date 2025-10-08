import {ObjectId} from "mongodb";
import { Pedido } from "../Domain/Pedido.js";
import { PedidoModel } from "../Schemas/PedidoSchema.js";
import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";

export class PedidoRepository {
    /*
    collection
    pedidos = []
    usuarioRepository
    productoRepository
    */
    constructor() {
        this.model = PedidoModel;
    }
/*
    dePedidoDominioAPedidoDB(pedido){
        const nuevoPedido = {
            idComprador: new ObjectId(pedido.getComprador().getId()),
            itemsPedidos: itemsPedidos.map(item => ({
                producto: item.getProductoId(),
                cantidad: item.getCantidad(),
                precioUnitario: item.getPrecioUnitario()
                })
            ),
            moneda: pedido.getMoneda(),
            direccionEntrega: pedido.getDireccionEntrega(),
            estado: 'PENDIENTE',
            fechaCreacion: new Date(),
            historialEstados: []
        };
        delete nuevoPedido.id;
        return nuevoPedido;
    }

    async dePedidoDBAPedidoDominio(pedidoDB){
        const pedido = new Pedido();
        Object.assign(pedido, {
            id: pedidoDB._id.toString(),
            comprador: await this.usuarioRepository.obtenerUsuarioPorId(pedidoDB.idComprador),
            itemsPedidos: await Promise.all(pedidoDB.itemsPedidos.map(async item => ({
                producto: await this.productoRepository.obtenerProductoPorId(item.producto),
                cantidad: item.cantidad,    
                precioUnitario: item.precioUnitario
            }))),
            moneda: pedidoDB.moneda,
            direccionEntrega: pedidoDB.direccionEntrega,
            estado: pedidoDB.estado,
            fechaCreacion: pedidoDB.fechaCreacion,
            historialEstados: pedidoDB.historialEstados
        });
        return pedido;
    }
*/  
    async crearPedido(pedido){
        const pedidoNuevo = new this.model(pedido);
        const pedidoGuardado = await pedidoNuevo.save();
        return pedidoGuardado;
    }

    async actualizarPedido(pedido){
        let pedidoActualizado = await this.model.findByIdAndUpdate(
            pedido.id || pedido._id,
            pedido, 
            {new: true, runValidators: true}
        );
        pedidoActualizado = await this.obtenerProductosDePedido(pedidoActualizado);
        return pedidoActualizado;
    }

    async obtenerPedidosPorUsuarioId(usuarioId) {
        const pedidos = await this.model.find({ idComprador: usuarioId });
        return Promise.all(pedidos.map(p => this.obtenerProductosDePedido(p)));
    }

    async obtenerProductosDePedido(pedido) {
        await pedido.populate('items.productoId');
        return pedido;
    }

    async obtenerPedidoPorId(pedidoId) {
        const pedido = await this.model.findById(pedidoId);
        return await this.obtenerProductosDePedido(pedido);
    }


}
  
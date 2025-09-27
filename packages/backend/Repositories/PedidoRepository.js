import {ObjectId} from "mongodb";
import { Pedido } from "../Dominio/Pedido.js";
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

    async obtenerPedidosPorUsuarioId(usuarioId){
        return await this.model.find({idComprador: usuarioId});
    }

    async obtenerPedidoPorId(pedidoId){
        return await this.model.findById(pedidoId);
    }

    async actualizarPedido(pedido){
        if (pedido.id || pedido._id) {
            const pedidoActualizado = await this.model.findByIdAndUpdate(
                pedido.id || pedido._id,
                pedido, 
                {new: true, runValidators: true}
            );
            return pedidoActualizado;   
        } else {
            throw new NoExisteIdException;
        }
    }

}
  
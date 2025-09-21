import {ObjectId} from "mongodb";
import { Pedido } from "../Dominio/Pedido.js";

export class PedidoRepository {
    
    collection
    pedidos = []
    usuarioRepository
    productoRepository

    constructor(db, usuarioRepository, productoRepository) {
        this.collection = db.collection('pedidos');
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

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
    
    async crearPedido(pedido){
        const pedidoDB = this.dePedidoDominioAPedidoDB(pedido);
        const result = await this.collection.insertOne(pedidoDB);
        pedido.id = result.insertedId.toString();
        return pedido;
    }

    async obtenerPedidosPorUsuarioId(usuarioId){
        const objectIdUsuario = new ObjectId(usuarioId);

        const pedidosDB = await this.collection.find({idComprador: objectIdUsuario}).toArray();
    
        const pedidosDominio = [];

        for (const pedidoDB of pedidosDB) {
            const pedidoDominio = await this.dePedidoDBAPedidoDominio(pedidoDB);
            pedidosDominio.push(pedidoDominio);
        }
        
        return pedidosDominio;
    }

    async obtenerPedidoPorId(pedidoId){
        const objectIdPedido = new ObjectId(pedidoId);

        const pedidoDB = await this.collection.findOne({_id: objectIdPedido});

        const pedidoDominio = await this.dePedidoDBAPedidoDominio(pedidoDB);

        return pedidoDominio;
    }

    async actualizarPedido(pedido){
        const pedidoDB = this.dePedidoDominioAPedidoDB(pedido); 
        const objectIdPedido = new ObjectId(pedido.id);
        await this.collection.updateOne({_id: objectIdPedido}, {$set: pedidoDB},{upsert: false});
    }

}
  
import {ObjectId} from "mongodb";

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
            moneda: moneda,
            direccionEntrega: direccionEntrega,
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


}
  
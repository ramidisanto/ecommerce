import { EstadoPedido } from "../Domain/EstadoPedido.js";

export class PedidoService{
    constructor(pedidoRepository, itemPedidoRepository, usuarioRepository, productoRepository){
        this.pedidoRepository = pedidoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    async crearPedido(comprador, items, moneda, direccionEntrega){
        for (const item of items) {
            const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
            producto.validarDisponible(item.getCantidad());
        }
        const itemsPedido = [];
        for(const item of items){
            const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
            const itemPedido = new ItemPedido(producto, item.getCantidad(), item.getPrecioUnitario());
            itemsPedido.push(itemPedido);
        }
        const pedido = new Pedido(comprador, itemsPedido, moneda, direccionEntrega);
        const nuevoPedido = await this.pedidoRepository.crearPedido(comprador, itemsPedido, moneda, direccionEntrega);
        for (const item of itemsPedido) {
            const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
            producto.reducirStock(item.getCantidad());
            await this.productoRepository.actualizarProducto(producto);
        }
        return nuevoPedido;
    }

    async obtenerHistorialPedidos(usuarioId){
        const pedidos = await this.pedidoRepository.obtenerPedidosPorUsuarioId(usuarioId);
        return pedidos;
    }

    async marcarPedidoEnviado(pedidoId, vendedor){
        const pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
        
        pedido.actualizarEstado(EstadoPedido.ENVIADO, vendedor, "Pedido enviado"); 
        await this.pedidoRepository.actualizarPedido(pedido);
        return pedido;
    }
}
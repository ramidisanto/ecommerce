export class PedidoService{
    constructor(pedidoRepository, itemPedidoRepository, usuarioRepository){
        this.pedidoRepository = pedidoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async crearPedido(comprador, items, moneda, direccionEntrega){
        for (const item of items) {
            const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
            producto.validarDisponible(item.getCantidad());
        }
        const itemsPedidos = [];
        for(const item of items){
            const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
            const nuevoItemPedido = await this.itemPedidoRepository.crearItemPedido(producto, item.getCantidad(), item.getPrecioUnitario());
            itemsPedidos.push(nuevoItemPedido);
        }
        const nuevoPedido = await this.pedidoRepository.crearPedido(comprador, itemsPedidos, moneda, direccionEntrega);
        for (const item of itemsPedidos) {
            const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
            producto.reducirStock(item.getCantidad());
            await this.productoRepository.actualizarProducto(producto);
        }
        return nuevoPedido;
    }    
}
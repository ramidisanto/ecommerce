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
}
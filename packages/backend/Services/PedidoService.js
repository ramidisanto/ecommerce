import { EstadoPedido } from "../Domain/EstadoPedido.js";
import { ItemPedido } from "../Domain/ItemPedido.js";
import { Pedido } from "../Domain/Pedido.js";

export class PedidoService{
    constructor(pedidoRepository, usuarioRepository, productoRepository, servicioNotificacion){
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.servicioNotificacion = servicioNotificacion;
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
        const notificacion = this.factoryNotificacion.crearNotificacion(pedido);
        await this.servicioNotificacion.enviarNotificacion(notificacion);
        return nuevoPedido;
    }


    async cancelarPedido(pedidoId, usuario){
        const pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
        pedido.validarSePuedeCancelar(usuario);
        pedido.actualizarEstado(EstadoPedido.CANCELADO, usuario, "Pedido cancelado por el usuario");
        await this.pedidoRepository.actualizarPedido(pedido);   
        for (const item of pedido.getItems()) {
            const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
            producto.aumentarStock(item.getCantidad());
            await this.productoRepository.actualizarProducto(producto);
        }
        const notificacion = this.factoryNotificacion.crearNotificacion(pedido);
        await this.servicioNotificacion.enviarNotificacion(notificacion);
        return pedido;
    }

    async obtenerHistorialPedidos(usuarioId){
        const pedidos = await this.pedidoRepository.obtenerPedidosPorUsuarioId(usuarioId);
        return pedidos;
    }

    async marcarPedidoEnviado(pedidoId, vendedor){
        const pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
        
        pedido.actualizarEstado(EstadoPedido.ENVIADO, vendedor, "Pedido enviado"); 
        await this.pedidoRepository.actualizarPedido(pedido);
        const notificacion = this.factoryNotificacion.crearNotificacion(pedido);
        await this.servicioNotificacion.enviarNotificacion(notificacion);
        return pedido;
    }
}
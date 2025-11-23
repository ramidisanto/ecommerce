import { EstadoPedido } from "../Domain/EstadoPedido.js";
import { ItemPedido } from "../Domain/ItemPedido.js";
import { Pedido } from "../Domain/Pedido.js";
import { FactoryNotificacion } from "../Domain/FactoryNotificacion.js";
import { TipoUsuario } from "../Domain/TipoUsuario.js";
import { Usuario } from "../Domain/Usuario.js";
import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";
import { UsuarioRepository } from "../Repositories/UsuarioRepository.js";
import { ProductoRepository } from "../Repositories/ProductoRepository.js";
import { PedidoRepository } from "../Repositories/PedidoRepository.js";
import { CambioEstadoPedido } from "../Domain/CambioEstadoPedido.js";
export class PedidoService{
    constructor(pedidoRepository, usuarioRepository, productoRepository, servicioNotificacion, factoryNotificacion ){
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.servicioNotificacion = servicioNotificacion;
        this.factoryNotificacion = factoryNotificacion;
    }

   

async crearPedido(comprador, items, moneda, direccionEntrega) {
    
    const itemsPedido = [];
    for (const item of items) {
        const producto = await this.productoRepository.obtenerProductoPorId(item.productoId);
        if (!producto) throw new NoExisteIdException(item.productoId, "producto");
        producto.validarDisponible(item.cantidad);
        const itemPedido = new ItemPedido(producto, item.cantidad, item.precioUnitario);
        itemsPedido.push(itemPedido);
    }

    const pedido = new Pedido(comprador, itemsPedido, moneda, direccionEntrega);

    const estadoInicial = new CambioEstadoPedido(EstadoPedido.Pendiente, comprador, "Pedido creado");
    const pedidoParaGuardar = {
        comprador: comprador._id || comprador.id,
        items: itemsPedido.map(i => ({
            producto: i.getProductoId(),
            cantidad: i.getCantidad(),
            precioUnitario: i.getPrecioUnitario()
        })),
        moneda,
        direccionEntrega,
        estado: "PENDIENTE",
        historialEstados: [estadoInicial]
    };

    const pedidoGuardado = await this.pedidoRepository.crearPedido(pedidoParaGuardar);

    for (const item of itemsPedido) {
        const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
        producto.reducirStock(item.getCantidad());
        await this.productoRepository.actualizarProducto(producto);
    }
    const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
    await this.servicioNotificacion.enviarNotificacion(notificacion);

    return pedidoGuardado;
}


    async cancelarPedido(pedidoId){
        const pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
        if (!pedido){
            throw new NoExisteIdException(pedidoId, "pedido");
        }
        pedido.validarSePuedeCancelar();
        pedido.actualizarEstado(EstadoPedido.Cancelado, pedido.comprador, "Pedido cancelado por el usuario");
        await this.pedidoRepository.actualizarPedido(pedido);   

        const items_domain = [];

        for (const item of pedido.getItems()) {
            const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
            producto.aumentarStock(item.cantidad);
            await this.productoRepository.actualizarProducto(producto);
        }

        const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
        await this.servicioNotificacion.enviarNotificacion(notificacion);

        return pedido;
    }

    async obtenerHistorialPedidos(usuarioId){
        const pedidos = await this.pedidoRepository.obtenerPedidosPorUsuarioId(usuarioId);
        const pedidosCompletos = pedidos.map(datos => {
            const itemsDomain = datos.items.map(item =>
            {
                return new ItemPedido(item.producto, item.cantidad, item.precioUnitario);
            });
            const pedidoDomain = new Pedido(
                datos.comprador,
                itemsDomain,
                datos.moneda,
                datos.direccionEntrega
            );
            pedidoDomain.id = datos._id;
            pedidoDomain.fechaCreacion = datos.fechaCreacion;
            pedidoDomain.estado = datos.estado;
            pedidoDomain.historialEstados = datos.historialEstados;

            const totalCalculado = pedidoDomain.calcularTotal();

            return{
                ...datos.toObject(),
                total: totalCalculado
            };
        });
        return pedidosCompletos;
        
    }

    async marcarPedidoEnviado(pedidoId){
        const pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
        let pedidos = [];
        pedidos.push(pedido);
        if (!pedido){
            throw new NoExisteIdException(pedidoId, "pedido");
        }
        pedido.actualizarEstado(EstadoPedido.Enviado, pedido.getComprador(), "Pedido enviado");
        await this.pedidoRepository.actualizarPedido(pedido);
        const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
        await this.servicioNotificacion.enviarNotificacion(notificacion);
        const pedidosCompletos = pedidos.map(datos => {
            const itemsDomain = datos.items.map(item =>
            {
                return new ItemPedido(item.producto, item.cantidad, item.precioUnitario);
            });
            const pedidoDomain = new Pedido(
                datos.comprador,
                itemsDomain,
                datos.moneda,
                datos.direccionEntrega
            );
            pedidoDomain.id = datos._id;
            pedidoDomain.fechaCreacion = datos.fechaCreacion;
            pedidoDomain.estado = datos.estado;
            pedidoDomain.historialEstados = datos.historialEstados;

            const totalCalculado = pedidoDomain.calcularTotal();

            return{
                ...datos.toObject(),
                total: totalCalculado
            };
        });
        return pedidosCompletos;
    }

    async obtenerVentasVendedor(vendedorId){

        const IdsDeProductos = await this.productoRepository.obtenerProductosDelVendedor(vendedorId);
        
        const pedidos = await this.pedidoRepository.obtenerPedidosPorVendedorId(IdsDeProductos);
        const pedidosCompletos = pedidos.map(datos => {
            const itemsDomain = datos.items.map(item =>
            {
                return new ItemPedido(item.producto, item.cantidad, item.precioUnitario);
            });
            const pedidoDomain = new Pedido(
                datos.comprador,
                itemsDomain,
                datos.moneda,
                datos.direccionEntrega
            );
            pedidoDomain.id = datos._id;
            pedidoDomain.fechaCreacion = datos.fechaCreacion;
            pedidoDomain.estado = datos.estado;
            pedidoDomain.historialEstados = datos.historialEstados;

            const totalCalculado = pedidoDomain.calcularTotal();

            return{
                ...datos.toObject(),
                total: totalCalculado
            };
        });
        return pedidosCompletos;
    }
}
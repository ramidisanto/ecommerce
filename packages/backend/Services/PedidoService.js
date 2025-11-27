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

export class PedidoService {
    constructor(pedidoRepository, usuarioRepository, productoRepository, servicioNotificacion, factoryNotificacion) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.servicioNotificacion = servicioNotificacion;
        this.factoryNotificacion = factoryNotificacion;
    }


    async crearPedido(comprador, items, moneda, direccionEntrega) {

        const productosIds = items.map(item => item.productoId);
        const productos = await this.productoRepository.obtenerProductosPorIds(productosIds);
        const productosMap = new Map(productos.map(p => [p._id.toString(), p]));
        const itemsPedido = [];
        for (const item of items) {
            const producto = productosMap.get(item.productoId.toString());
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
        const stockUpdates = itemsPedido.map(item => ({
            productoId: item.getProductoId(),
            cantidadIncremento: -item.getCantidad()
        }));
        await this.productoRepository.actualizarStockEnLote(stockUpdates);

        const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
        await this.servicioNotificacion.enviarNotificacion(notificacion);

        return pedidoGuardado;
    }


    async cancelarPedido(pedidoId) {
        const pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
        if (!pedido) {
            throw new NoExisteIdException(pedidoId, "pedido");
        }
        pedido.validarSePuedeCancelar();
        pedido.actualizarEstado(EstadoPedido.Cancelado, pedido.comprador, "Pedido cancelado por el usuario");
        await this.pedidoRepository.actualizarPedido(pedido);

        const stockUpdates = pedido.getItems().map(item => ({
            productoId: item.getProductoId(),
            cantidadIncremento: item.cantidad 
        }));
        await this.productoRepository.actualizarStockEnLote(stockUpdates);

        const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
        await this.servicioNotificacion.enviarNotificacion(notificacion);

        return pedido;
    }


    async obtenerHistorialPedidos(usuarioId) {
        const pedidos = await this.pedidoRepository.obtenerPedidosPorUsuarioId(usuarioId);

        const pedidosConTotal = pedidos.map(pedido => {
            const total = pedido.items.reduce((sum, item) => {
                return sum + (item.cantidad * item.precioUnitario);
            }, 0);

            return {
                ...pedido.toObject(),
                total
            };
        });

        return pedidosConTotal;
    }

   
    async marcarPedidoEnviado(pedidoId) {
        const pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
        if (!pedido) {
            throw new NoExisteIdException(pedidoId, "pedido");
        }
        pedido.actualizarEstado(EstadoPedido.Enviado, pedido.getComprador(), "Pedido enviado");
        await this.pedidoRepository.actualizarPedido(pedido);

        const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
        await this.servicioNotificacion.enviarNotificacion(notificacion);

        const total = pedido.items.reduce((sum, item) => {
            return sum + (item.cantidad * item.precioUnitario);
        }, 0);

        return {
            ...pedido.toObject(),
            total
        };
    }

    async obtenerVentasVendedor(vendedorId) {
        const IdsDeProductos = await this.productoRepository.obtenerProductosDelVendedor(vendedorId);
        const pedidos = await this.pedidoRepository.obtenerPedidosPorVendedorId(IdsDeProductos);
        const ventasConTotal = pedidos.map(pedido => {
            const total = pedido.items.reduce((sum, item) => {
                return sum + (item.cantidad * item.precioUnitario);
            }, 0);

            return {
                ...pedido.toObject(),
                total
            };
        });

        return ventasConTotal;
    }
}
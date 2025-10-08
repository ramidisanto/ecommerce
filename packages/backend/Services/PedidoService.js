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

export class PedidoService{
    constructor(pedidoRepository, usuarioRepository, productoRepository, servicioNotificacion, factoryNotificacion ){
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.servicioNotificacion = servicioNotificacion;
        this.factoryNotificacion = factoryNotificacion;
    }

    // async crearPedido(comprador, items, moneda, direccionEntrega){
        
    //     for (const item of items) {
    //         const producto = await this.productoRepository.obtenerProductoPorId(item.productoId);
    //         if (!producto) throw new NoExisteIdException(item.productoId, "producto");
    //         producto.validarDisponible(item.cantidad);
    //     }
    //     const itemsPedido = [];
    //     for(const item of items){
    //         const producto = await this.productoRepository.obtenerProductoPorId(item.productoId);
    //         const itemPedido = new ItemPedido(producto, item.cantidad, item.precioUnitario);
    //         itemsPedido.push(itemPedido);
    //     }
        
    //     const pedido = new Pedido(comprador, itemsPedido, moneda, direccionEntrega);

    //     const nuevoPedido = await this.pedidoRepository.crearPedido(pedido);

    //     //const pedido = new Pedido(comprador, itemsPedido, moneda, direccionEntrega);

        
    //     const pedidoParaGuardar = {
    //     comprador: comprador._id || comprador.id,
    //     items: itemsPedido.map(item => ({
    //     productoId: item.getProductoId(), 
    //     cantidad: item.getCantidad(),
    //     precioUnitario: item.getPrecioUnitario()
    //     })),
    //     moneda,
    //     direccionEntrega: {
    //     calle: direccionEntrega.calle,
    //     altura: direccionEntrega.altura,
    //     piso: direccionEntrega.piso,
    //     departamento: direccionEntrega.departamento,
    //     codigoPostal: direccionEntrega.codigoPostal,
    //     ciudad: direccionEntrega.ciudad,
    //     provincia: direccionEntrega.provincia,
    //     pais: direccionEntrega.pais,
    //     lat: direccionEntrega.lat,
    //     lon: direccionEntrega.lon
    //     },
    //     estado: "PENDIENTE",
    //     historialEstados: []
    //     };

    //     //const nuevoPedido = await this.pedidoRepository.crearPedido(pedidoParaGuardar);

    //     for (const item of itemsPedido) {
    //         const producto = await this.productoRepository.obtenerProductoPorId(item.getProductoId());
    //         producto.reducirStock(item.getCantidad());
    //         await this.productoRepository.actualizarProducto(producto);
    //     }

    //     const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
    //     await this.servicioNotificacion.enviarNotificacion(notificacion);
    //     return nuevoPedido;
    // }

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

    const pedidoParaGuardar = {
        comprador: comprador._id || comprador.id,
        items: itemsPedido.map(i => ({
            productoId: i.getProductoId(),
            cantidad: i.getCantidad(),
            precioUnitario: i.getPrecioUnitario()
        })),
        moneda,
        direccionEntrega,
        estado: "PENDIENTE",
        historialEstados: []
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


    async cancelarPedido(pedidoId, usuarioId){
        console.log("entrada al servicio");
        const pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
        if (!pedido){
            throw new NoExisteIdException(pedidoId, "pedido");
        }
        console.log("pedido encontrado");
        pedido.validarSePuedeCancelar();
        const usuario = await this.usuarioRepository.findById(usuarioId);
        pedido.actualizarEstado(EstadoPedido.Cancelado, usuario, "Pedido cancelado por el usuario");
        console.log("pedido cancelado");
        await this.pedidoRepository.actualizarPedido(pedido);   
        console.log("pedido actualizado");

        const items_domain = [];

        for (const item of pedido.getItems()) {
            const producto = await this.productoRepository.obtenerProductoPorId(item.productoId);
            const item_domain = new ItemPedido(producto, item.cantidad, item.precioUnitario);
            items_domain.push(item_domain);
            producto.aumentarStock(item.cantidad);
            await this.productoRepository.actualizarProducto(producto);
        }
        console.log("stock actualizado");

        pedido.itemsPedidos = items_domain;
        console.log("pedido items actualizados");
        const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
        console.log("notificacion creada");
        await this.servicioNotificacion.enviarNotificacion(notificacion);
        console.log("notificacion enviada");
        return pedido;
    }

    async obtenerHistorialPedidos(usuarioId){
        if(!usuarioId){
            throw new NoExisteIdException(usuarioId, "usuario");
        }
        const pedidos = await this.pedidoRepository.obtenerPedidosPorUsuarioId(usuarioId);
        return pedidos;
    }

    async marcarPedidoEnviado(pedidoId, vendedor){
        const pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
        if (!pedido){
            throw new NoExisteIdException(pedidoId, "pedido");
        }
        pedido.actualizarEstado(EstadoPedido.Enviado, vendedor, "Pedido enviado"); 
        await this.pedidoRepository.actualizarPedido(pedido);
        const notificacion = this.factoryNotificacion.crearNotificacion(pedido);
        await this.servicioNotificacion.enviarNotificacion(notificacion);
        return pedido;
    }
}
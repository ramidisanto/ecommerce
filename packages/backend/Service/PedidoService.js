import { Pedido } from "../Model/";
import { FactoryNotificacion } from "../Domain/FactoryNotificacion";
import { PedidoRepository } from "../Repository/PedidoRepository";
import { CambioEstadoPedido } from "../Domain/CambioEstadoPedido";

export class PedidoService {

    pedidoRepository;

    constructor(pedidoRepositorio) {
        this.pedidoRepository = pedidoRepositorio;
    }

    crearPedido(pedidoData) {
        const pedido = new Pedido(pedidoData.comprador, pedidoData.items, pedidoData.moneda, pedidoData.direccionEntrega, Date.now());
        this.pedidoRepository.save(pedido);
        this.notificar(pedido);
        return pedido;
    }

  // actualizarEstado(nuevoEstado: EstadoPedido, quien: Usuario, motivo: String): void
    actualizarEstado(estado, usuario, motivo, pedido) {
        const nuevoEstado = new CambioEstadoPedido(new Date(), estado, pedido, usuario, motivo);
        pedido.guardarCambioEstado(nuevoEstado);
        this.notificar(pedido);
    }

    notificar(pedido) {
        const notificacion = FactoryNotificacion.crearSegunPedido(pedido);
        const usuario = notificacion.getUsuarioDestino();
        usuario.agregarNotificacion(notificacion);
    }
    
}
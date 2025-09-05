import { Notificacion } from "../Domain/Notificacion.js";
import { EstadoPedido } from "../Domain/EstadoPedido.js";

import EstadoCancelado from "./Estados/EstadoCancelado.js";
import { EstadoEnviado } from "./Estados/EstadoEnviado.js";
import { EstadoEntregado } from "./Estados/EstadoEntregado.js";
import { EstadoPendiente } from "./Estados/EstadoPendiente.js";
import { EstadoEnPreparacion } from "./Estados/EstadoEnPreparacion.js";
import { EstadoConfirmado } from "./Estados/EstadoConfirmado.js";

const estadosMap = {
    [EstadoPedido.CANCELADO]: new EstadoCancelado(),
    [EstadoPedido.ENVIADO]: new EstadoEnviado(),
    [EstadoPedido.ENTREGADO]: new EstadoEntregado(),
    [EstadoPedido.PENDIENTE]: new EstadoPendiente(),
    [EstadoPedido.EN_PREPARACION]: new EstadoEnPreparacion(),
    [EstadoPedido.CONFIRMADO]: new EstadoConfirmado(),
};

export class FactoryNotificacion {

    crearSegunEstado(estado) {
    const estadoDePedido = estadosMap[estado];
    if (!estadoDePedido) {
        throw new Error("Estado no reconocido");
    }
    return estadoDePedido.emitirMensajeEstadoPedido();
    }

    crearSegunPedido(pedido) {
        const mensaje = this.crearSegunEstado(pedido.getEstado());

        if (pedido.getEstado() == EstadoPedido.CANCELADO || pedido.getEstado() == EstadoPedido.PENDIENTE) {

        return new Notificacion(pedido.getVendedor(), mensaje, Date.now()); // PREGUNTAR SI CAMBIAMOS QUE CADA PEDIDO TENGA UN VENDEDOR SOLO VENDEDOR O TIENE MAS DE UNO

        } else if (pedido.getEstado() == EstadoPedido.ENVIADO) {

            return new Notificacion(pedido.getComprador(), mensaje, Date.now());

        } else {
            return  null //new Notificacion(pedido.vendedor, mensaje, Date.now()); por ahora no notifica nada en estos estados
        }
    }

}


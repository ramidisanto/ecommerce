import { Notificacion } from "../Domain/Notificacion.js";
import { Pedido } from "../Domain/";
import { EstadoPedido } from "../Domain/EstadoPedido.js";
export class FactoryNotificacion {

    crearSegunEstado(estado) {
        let estadoPedido;
        switch (estado) {
            case EstadoPedido.CANCELADO:
                 estadoPedido = "El pedido ha sido cancelado.";
                break;
            case EstadoPedido.ENVIADO:
                estadoPedido = "El pedido ha sido enviado.";
                break;
            case EstadoPedido.ENTREGADO:
                 estadoPedido = "El pedido ha sido entregado.";
                break;
            case EstadoPedido.PENDIENTE:
                 estadoPedido = "El pedido ha sido creado.";
                break;
            case EstadoPedido.EN_PREPARACION:
                 estadoPedido = "El pedido está en preparación.";
                break;
            case EstadoPedido.CONFIRMADO:
                 estadoPedido = "El pedido ha sido confirmado.";
                break;
            default:
                throw new Error("Estado no reconocido");
        }
    
        return estadoPedido;
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

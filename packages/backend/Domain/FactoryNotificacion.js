import { Notificacion } from "./Notificacion.js";
import { EstadoPedido } from "./EstadoPedido.js";
import { Pedido } from "./Pedido.js";
import { ItemPedido } from "./ItemPedido.js";
class FactoryNotificacion {

    crearSegunEstado(estado) {
        let mensaje
        switch (estado) {
            case EstadoPedido.Cancelado:
                mensaje = "El pedido ha sido cancelado.";
                break;
            case EstadoPedido.Enviado:
                mensaje = "El pedido ha sido enviado.";
                break;
            case EstadoPedido.Entregado:
                mensaje = "El pedido ha sido entregado.";
                break;
            case EstadoPedido.Pendiente:
                mensaje = "El pedido ha sido creado.";
                break;
            case EstadoPedido.En_Preparacion:
                mensaje = "El pedido está en preparación.";
                break;
            case EstadoPedido.Confirmado:
                mensaje = "El pedido ha sido confirmado.";
                break;
            default:
                throw new Error("Estado no reconocido");
        }
    
        return mensaje;
    }

    crearSegunPedido(pedido) {
        const estado = pedido.getEstado();

        if (estado == EstadoPedido.Cancelado) {  // CASO QUE SE CANCELA EL PEDIDO
            const mensaje = this.crearSegunEstado(pedido.getEstado());
            return new Notificacion(pedido.getVendedor(), mensaje, Date.now());

        } else if (estado == EstadoPedido.Enviado) {    // CASO QUE SE ENVIA EL PEDIDO
            const mensaje = this.crearSegunEstado(pedido.getEstado());
            return new Notificacion(pedido.getComprador(), mensaje, Date.now());

        } else if (estado == EstadoPedido.Pendiente) { // CASO QUE SE REALIZA LA COMPRA
            
            const mensaje = `Nuevo pedido de ${pedido.getNombreComprador()}, sobre los productos ${pedido.getNombreItems().join(", ")}. Total: ${pedido.getTotal()} ${pedido.getMoneda()}. Entrega en: ${pedido.getDireccionEntrega()}`;
            console.log(mensaje);
            return new Notificacion(pedido.getVendedor(), mensaje, Date.now());
        }
    }
}

export const factoryNotificacion = new FactoryNotificacion();
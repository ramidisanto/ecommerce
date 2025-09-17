export class PedidoController {
    constructor(servicioPedido, servicioNotificacion, factoryNotificacion) {
        this.servicioPedido = servicioPedido;
        this.servicioNotificacion = servicioNotificacion;
        this.factoryNotificacion = factoryNotificacion;
    }   

crearPedido = async (req, res, next) => {
    try{
        const comprador = req.usuario;
        const items = req.body.items;
        const moneda = req.body.moneda;
        const direccionEntrega = req.body.direccionEntrega;
        const pedido = await this.servicioPedido.crearPedido(comprador, items, moneda, direccionEntrega);
        res.status(201).json(pedido);
    }
    catch(error){
        next(error);
    }
}
}

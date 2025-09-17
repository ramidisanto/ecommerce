export class PedidoController {
    constructor(servicioPedido, servicioNotificacion, factoryNotificacion) {
        this.servicioPedido = servicioPedido;
        this.servicioNotificacion = servicioNotificacion;
        this.factoryNotificacion = factoryNotificacion;
    }   

crearPedido = async (req, res, next) => {
    try{
        const comprador = req.usuario;
        const {items, moneda, direccionEntrega} = req.body;
        const nuevoPedido = await this.servicioPedido.crearPedido(comprador, items, moneda, direccionEntrega);
        res.status(201).json(nuevoPedido);
    }
    catch(error){
        next(error);
    }
}
}

import { z } from "zod";
import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";
export class PedidoController {

    constructor(servicioPedido, servicioNotificacion, factoryNotificacion, usuarioService){
        this.usuarioService = usuarioService;
        this.servicioPedido = servicioPedido;
        this.servicioNotificacion = servicioNotificacion;
        this.factoryNotificacion = factoryNotificacion;
    }   

crearPedido = async (req, res, next) => {
        const resultId = idTransform.safeParse(req.params.id); 

        if (resultId.error) {
            res.status(400).json(resultId.error.issues);
            return;
        }

        const compradorId = resultId.data;
        const comprador = await this.usuarioService.findById(compradorId);
        if (!comprador) throw new NoExisteIdException(compradorId, "usuario");

        const items = req.body.items;
        const moneda = req.body.moneda;
        const direccionEntrega = req.body.direccionEntrega;
        const pedido = await this.servicioPedido.crearPedido(comprador, items, moneda, direccionEntrega);
        res.status(201).json(aPedidoRest(pedido));

}

cancelarPedido = async (req, res, next) => {
    const resultId = idTransform.safeParse(req.params.id); 

    if (resultId.error) {
            res.status(400).json(resultId.error.issues);
            return;
    }

        const pedidoId = resultId.data;
        const pedido = await this.servicioPedido.cancelarPedido(pedidoId);
        
        if(pedido){
            
            res.status(200).json(aPedidoRest(pedido));
        } else {
            res.status(404).json({error: 'Pedido no encontrado'});
        }
}

obtenerHistorial = async (req, res) => {
    
    const resultId = idTransform.safeParse(req.params.id); 

    if (resultId.error) {
        res.status(400).json(resultId.error.issues);
        return;
    }

    const usuarioId = resultId.data;

    const usuario = await this.usuarioService.findById(usuarioId);
    if (!usuario) throw new NoExisteIdException(usuarioId, "usuario");

    const pedidos = await this.pedidoService.obtenerHistorialPedidos(usuarioId);
    if (!pedidos || pedidos.length === 0) return res.status(204).send();

    res.status(200).json(pedidos.map(aPedidoRest));
    }

marcarPedidoEnviado = async (req, res, next) => {
    const resultId = idTransform.safeParse(req.params.id);

    if (resultId.error) {
        res.status(400).json(resultId.error.issues);
        return;
    }

    const pedidoId = resultId.data;
    const vendedor = req.usuario;

    const pedido = await this.pedidoService.marcarPedidoEnviado(pedidoId, vendedor);
    if (!pedido) throw new NoExisteIdException(pedidoId, "pedido");

    res.status(200).json({ message: "Pedido marcado como enviado" });

}
}

const aPedidoRest = (pedido) => ({
    id: pedido.id,
    comprador: pedido.getNombreComprador(),
    items: pedido.getItems().map(item => ({
        producto: item.getProductoId(),
        cantidad: item.getCantidad(),
        precioUnitario: item.getPrecioUnitario()
    })),
    total: pedido.getTotal(),
    moneda: pedido.getMoneda(),
    direccionEntrega: pedido.getDireccionEntrega(),
    estado: pedido.getEstado(),
    fechaCreacion: pedido.fechaCreacion,
    historialEstados: pedido.getHistorialEstados().map(estado => ({
        fecha: estado.fecha,
        estado: estado.estado,
        quien: estado.usuario.getNombre(),
        motivo: estado.motivo
    }))
});

const idTransform = z.string().transform((val, ctx) => {
    const num = Number(val);
    if (isNaN(num)) {
    ctx.addIssue({
        code: "INVALID_ID",
        message: "id must be a number",
    });
        return z.NEVER;
    }
        return num;
});
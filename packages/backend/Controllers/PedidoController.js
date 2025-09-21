import { z } from "zod";
import { NoExisteException } from "../Excepciones/NoExisteException.js";
export class PedidoController {

    constructor(servicioPedido, servicioNotificacion, factoryNotificacion, usuarioService){
        this.usuarioService = usuarioService;
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

obtenerHistorial = async (req, res) => {
    
    const resultId = idTransform.safeParse(req.params.id); 

    if (resultId.error) {
        res.status(400).json(resultId.error.issues);
        return;
    }

    const usuarioId = resultId.data;

    const usuario = await this.usuarioService.findById(usuarioId);
    if (!usuario) throw new NoExisteException(usuarioId, "usuario");

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
    if (!pedido) throw new NoExisteException(pedidoId, "pedido");

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
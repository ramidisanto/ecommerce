import { z } from "zod";
import mongoose from "mongoose";
import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";
import {UsuarioService} from "../Services/UsuarioService.js";
import { PedidoService } from "../Services/PedidoService.js";
import { NotificacionService } from "../Services/NotificacionService.js";
export class PedidoController {

    constructor(servicioPedido, servicioNotificacion, usuarioService){
        this.usuarioService = usuarioService;
        this.servicioPedido = servicioPedido;
        this.servicioNotificacion = servicioNotificacion;
    }   

    async crearPedido (req, res){

        const resultbody = pedidoSchema.safeParse(req.body); 

        if (resultbody.error) {
            res.status(400).json(resultbody.error.issues);
            return;
        }


        const compradorId = resultbody.data.comprador;
        const comprador = await this.usuarioService.findById(compradorId);
        if (!comprador) throw new NoExisteIdException(compradorId, "usuario");

        const items = resultbody.data.items;
        const moneda = resultbody.data.moneda;
        const direccionEntrega = resultbody.data.direccionEntrega;
        const pedido = await this.servicioPedido.crearPedido(comprador, items, moneda, direccionEntrega);
        res.status(201).json(pedido);

}

     async cancelarPedido (req, res){

        const resultId = objectId.safeParse(req.params.id); 

        if (resultId.error) {
                res.status(400).json(resultId.error.issues);
                return;
        }

        const pedidoId = resultId.data;
        const pedido = await this.servicioPedido.cancelarPedido(pedidoId);
            
        if(pedido){   
            res.status(200).json(aPedidoRest(pedido));
        } else {
            throw new NoExisteIdException(pedidoId, "pedido");
        }
    }

     async obtenerHistorial (req, res){
        
        const resultId = objectId.safeParse(req.params.id); 

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

      async marcarPedidoEnviado(req, res){
        const resultId = objectId.safeParse(req.params.id);

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


// Validador de ObjectId de Mongoose
const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "El id de producto no es un ObjectId válido",
  });

// Schema para un item del pedido
const itemSchema = z.object({
  productoId: objectId,
  cantidad: z.number().int().min(1, "La cantidad debe ser al menos 1"),
  precioUnitario: z.number().positive("El precio debe ser mayor que 0"),
});

// Schema para la dirección de entrega
const direccionSchema = z.object({
  calle: z.string().min(1, "La calle es obligatoria"),
  altura: z.number().int().min(1, "La altura debe ser un número positivo"),
  piso: z.number().int().optional().nullable(),
  departamento: z.string().optional().nullable(),
  codigoPostal: z.number().int().min(1, "El código postal es obligatorio"),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
  provincia: z.string().min(1, "La provincia es obligatoria"),
  pais: z.string().min(1, "El país es obligatorio"),
  lat: z.number(),
  lon: z.number(),
});

// Schema principal del pedido
export const pedidoSchema = z.object({
    comprador: objectId,
    moneda: z.enum(["ARS", "USD", "EUR"]), 
    direccionEntrega: direccionSchema,
    items: z.array(itemSchema).min(1, "Debe haber al menos un item"),
});



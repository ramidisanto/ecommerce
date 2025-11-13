import { z } from "zod";
import mongoose from "mongoose";

export class ProductoController {
    constructor(productoService) {
        this.productoService = productoService;
    }

    async obtenerProductosPorVendedor(req, res) {
        const resultId = objectId.safeParse(req.params.id);

        if (resultId.error) {
            res.status(400).json(resultId.error.issues);
            return;
        }

        const vendedorId = resultId.data;
        const { page = 1, limit = 10 } = req.query;
        const filtros = req.query;

        const productosPaginados = await this.productoService.buscarTodosPorVendedor(page, limit, filtros, vendedorId)

        if (productosPaginados === null) {
            res.status(204).send();
            return;
        }
        res.status(200).json(productosPaginados);
    }

    async obtenerProductosDestacados(req, res) {
        const productos = await this.productoService.obtenerProductosDestacados();

        if (productos === null || productos.length === 0) {
            res.status(204).send();
            return;
        }

        res.status(200).json(productos);
    }

    async obtenerProductoPorId(req, res) {
        const resultId = objectId.safeParse(req.params.id); 
        if (resultId.error) {
            res.status(400).json(resultId.error.issues);
            return;
        }
        const productoId = resultId.data;

        const producto = await this.productoService.obtenerProductoPorId(productoId);
        if (!producto) {
            res.status(404).json({ message: `Producto con id ${productoId} no encontrado.` });
            return;
        }   
        res.status(200).json(producto);
    }

}


const objectId = z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "El id de producto no es un ObjectId válido",
    });


import { ProductoModel } from "../Schemas/ProductoSchema.js";

export class ProductoRepository {

    constructor() {
        this.model = ProductoModel;
    }

    async obtenerProductoPorId(id) {
        const producto = await this.model.findById(id);
        return producto;
    }

    async actualizarProducto(producto) {
        if (producto._id || producto.id) {
            const productoActualizado = await this.model.findByIdAndUpdate(
                producto._id || producto.id,
                producto,
                {
                    new: true,
                    runValidators: true
                }
            );
            return productoActualizado;
        }
    }

    async buscarConFiltros(query, pagina, elementosPorPagina, sortOption) {
        const skip = (pagina - 1) * elementosPorPagina;
        const productos = await this.model.find(query)
            .skip(skip)
            .limit(elementosPorPagina)
            .sort(sortOption).populate('vendedorId');

        const totalProductos = await this.model.countDocuments(query);
        const totalPaginas = Math.ceil(totalProductos / elementosPorPagina);

        return {
            productos,
            totalProductos,
            totalPaginas,
            pagina,
        };

    }


    async obtenerMasVendidoPorVendedor() {
        try {
            const productos = await this.model.aggregate([
                { $sort: { ventas: -1 } },
                {
                    $group: {
                        _id: "$vendedorId",
                        producto: { $first: "$$ROOT" }
                    }
                },
                { $replaceRoot: { newRoot: "$producto" } }
            ]);
            return productos;
        } catch (error) {
            console.error("Error en agregación de productos destacados:", error);
            throw error;
        }
    }

    async findById(id) {
        return await this.model.findById(id).populate('vendedorId');
    }

    async obtenerProductosDelVendedor(vendedorId) {

        const productosDelVendedor = await this.model.find({ vendedorId: vendedorId }).select('_id');

        if (productosDelVendedor.length === 0) {
            console.log('El vendedor no tiene productos, por lo tanto no hay pedidos.');
            return [];
        }

        const IdsDeProductos = productosDelVendedor.map(p => p._id);

        return IdsDeProductos;
    }

    // Métodos optimizados para operaciones en lote
    async obtenerProductosPorIds(ids) {
        return await this.model.find({ _id: { $in: ids } });
    }

    async actualizarStockEnLote(updates) {
        const operations = updates.map(({ productoId, cantidadIncremento }) => ({
            updateOne: {
                filter: { _id: productoId },
                update: { $inc: { stock: cantidadIncremento } }
            }
        }));
        return await this.model.bulkWrite(operations);
    }
}
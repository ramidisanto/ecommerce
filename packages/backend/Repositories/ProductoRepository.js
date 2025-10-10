import { ProductoModel } from "../Schemas/ProductoSchema.js";

export class ProductoRepository {

    constructor(){
        this.model = ProductoModel;
    }

    async obtenerProductoPorId(id){
        const producto = await this.model.findById(id);
        return producto;
    }

    async actualizarProducto(producto){
        if(producto._id || producto.id){
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

    async buscarConFiltros(query, pagina, elementosPorPagina, sortOption){
        const skip = (pagina - 1) * elementosPorPagina;
        const productos = await this.model.find(query)
            .skip(skip)
            .limit(elementosPorPagina)
            .sort(sortOption);

        const totalProductos = await this.model.countDocuments(query);
        const totalPaginas = Math.ceil(totalProductos / elementosPorPagina);

        return {
            productos,
            totalProductos,
            totalPaginas,
            pagina,
        };

    }
      
}
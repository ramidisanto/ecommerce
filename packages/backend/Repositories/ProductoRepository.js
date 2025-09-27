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
}
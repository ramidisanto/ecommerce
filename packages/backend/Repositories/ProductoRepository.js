import {ObjectId} from "mongodb";

export class ProductoRepository {

    collection

    constructor(db){
        this.collection = db.collection('productos');
    }

    deProductoDominioAProductoDB(producto){
        const nuevoProducto = {
            vendedorId: new ObjectId(producto.getVendedorId()),
            titulo: producto.titulo,
            descripcion: producto.descripcion, 
            precio: producto.precio,
            moneda: producto.moneda,
            stock: producto.stock,
            fotos: producto.fotos,
            activo: producto.activo
        };
        delete nuevoProducto.id;
        return nuevoProducto;
    }

    async deProductoDBAProductoDominio(productoDB){
        const producto = new Producto();
        Object.assign(producto, {
            id: productoDB._id.toString(),  
            vendedor: await this.usuarioRepository.obtenerUsuarioPorId(productoDB.vendedorId),
            titulo: productoDB.titulo,
            descripcion: productoDB.descripcion,
            precio: productoDB.precio,
            moneda: productoDB.moneda,
            stock: productoDB.stock,
            fotos: (productoDB.fotos || []),
            activo: productoDB.activo
        });
        return producto;
    }


    async obtenerProductoPorId(id){
        const productoDB = await this.collection.findOne({_id: new ObjectId(id)});
        if (!productoDB) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }   
        return productoDB;
    }

    async actualizarProducto(producto){
        const productoDB = this.deProductoDominioAProductoDB(producto);
        await this.collection.updateOne({_id: new ObjectId(producto.id)}, {$set: productoDB});
        return producto;
    }

}
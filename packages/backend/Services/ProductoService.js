import {Producto} from "../Domain/Producto.js";
import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";
import {Usuario} from "../Domain/Usuario.js";
import { ProductoRepository } from "../Repositories/ProductoRepository.js";
import { UsuarioRepository } from "../Repositories/UsuarioRepository.js";


export class ProductoService{
    constructor(ProductoRepository, UsuarioRepository){
        this.productoRepository = ProductoRepository
        this.usuarioRepository = UsuarioRepository
    }

    async buscarTodosPorVendedor(page, limit, filtros, vendedorId){
        const vendedor = await this.usuarioRepository.findById(vendedorId);
        if (!vendedor) {
            throw new NoExisteIdException(vendedorId, "vendedor");
        }

        vendedor.verificarEsVendedor();

        const query = { vendedorId: vendedorId };

        // Filtros opcionales
        if (filtros.titulo) {
            query.titulo = new RegExp(filtros.titulo, "i"); 
        }

        if (filtros.categorias) {
            query.categorias = new RegExp(filtros.categorias, "i");
        }

        if (filtros.descripcion) {
            query.descripcion = new RegExp(filtros.descripcion, "i");
        }

        if (filtros.precioMin || filtros.precioMax) {
            query.precio = {};
            if (filtros.precioMin) query.precio.$gte = parseFloat(filtros.precioMin);
            if (filtros.precioMax) query.precio.$lte = parseFloat(filtros.precioMax);
        }

        // Ordenamiento
        let sortOption = {};
        if (filtros.sort === "precioAsc") sortOption.precio = 1;
        if (filtros.sort === "precioDesc") sortOption.precio = -1;
        if (filtros.sort === "masVendido") sortOption.ventas = -1;

        const numeroPagina = Math.max(Number(page), 1);
        const elementosPorPagina = Math.min(Math.max(Number(limit), 1), 100);

        const productosDeVendedor = this.productoRepository.buscarConFiltros(query, numeroPagina, elementosPorPagina, sortOption);

        return productosDeVendedor
    }

    async obtenerProductosDestacados() {
        return this.productoRepository.obtenerMasVendidoPorVendedor();
    }

}
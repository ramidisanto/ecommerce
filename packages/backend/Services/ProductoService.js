import {Producto} from "../Domain/Producto.js";
import { NoExisteIdException } from "../Excepciones/NoExisteIdException.js";


export class ProductoService{
    constructor(ProductoRepository, UsuarioRepositoryUsuarioRepository){
        this.productoRepository = ProductoRepository
        this.usuarioRepository = UsuarioRepository
    }

    async buscarTodosPorVendedor(page, limit, filtros, vendedorId){
        const vendedor = await this.usuarioRepository.exists(vendedorId)
        if (!vendedor) {
            throw new NoExisteIdException(vendedorId, "vendedor");
        }

        vendedor.verificarEsVendedor();

         const query = { vendedorId: vendedorId };

        // Filtros opcionales
        if (filtros.titulo) {
            query.titulo = new RegExp(filtros.titulo, "i"); // búsqueda parcial
        }

        if (filtros.categoria) {
            query.categoria = new RegExp(filtros.categoria, "i");
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

        const productosDeVendedor = this.productoRepository.buscarConFiltros(query, numeroPagina, elementosPorPagina);

        return productosDeVendedor
    }

}
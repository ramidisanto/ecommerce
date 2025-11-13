import { jest } from "@jest/globals";
import {ProductoService } from "../../Services/ProductoService.js";
import { Usuario } from "../../Domain/Usuario.js";
import { Producto } from "../../Domain/Producto.js";
import { TipoUsuario } from "../../Domain/TipoUsuario.js";
import { UsuarioRepository } from "../../Repositories/UsuarioRepository.js";

describe('Test de ProductoService', () => {
    let usuarioRepositoryMock;
    let productoRepositoryMock;
    let service; 

    beforeEach(() => {
        usuarioRepositoryMock = {
            exists: jest.fn(),
            findById: jest.fn(),
        };
        productoRepositoryMock = {
           buscarConFiltros: jest.fn(),
        };
        service = new ProductoService(productoRepositoryMock, usuarioRepositoryMock);
    });

    test("Debe lanzar NoExisteIdException si el vendedor no existe", async () => {
        usuarioRepositoryMock.findById.mockResolvedValue(false);
        await expect(
            service.buscarTodosPorVendedor(1, 10, {}, "123")
        ).rejects.toThrow(/vendedor con id 123 no existe/);

        expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith("123");

    });

    test("Verificar que sea vendedor y se apliquen los filtros", async () => {
 
        //const vendedorMock = { verificarEsVendedor: jest.fn() };
        const vendedorMock = { 
            id: "abc", 
            nombre: "Maria",
            verificarEsVendedor: jest.fn() 
        };
        usuarioRepositoryMock.findById.mockResolvedValue(vendedorMock);
        const filtros = {
            titulo: "camiseta",
            categoria: "deporte",
            descripcion: "roja",
            precioMin: "100",
            precioMax: "500",
            sort: "precioAsc",
        };
        const productosMock = [{ id: 1, titulo: "camiseta roja" }];
        productoRepositoryMock.buscarConFiltros.mockResolvedValue(productosMock);

        const resultado = await service.buscarTodosPorVendedor(1, 10, filtros, "abc");

        expect(vendedorMock.verificarEsVendedor).toHaveBeenCalled();
        expect(productoRepositoryMock.buscarConFiltros).toHaveBeenCalledWith(
            {"descripcion": /roja/i, "precio": {"$gte": 100, "$lte": 500}, "titulo": /camiseta/i, "vendedorId": "abc"}, 1, 10, {"precio": 1});
        });

    test('Aplicar limites de paginacion', async () => {
        const vendedorMock = { verificarEsVendedor: jest.fn() };
        usuarioRepositoryMock.findById.mockResolvedValue(vendedorMock);
        productoRepositoryMock.buscarConFiltros.mockResolvedValue([]);

        await service.buscarTodosPorVendedor(-5, 200, {}, "abc");

        // page negativo => 1, limit mayor a 100 => 100
        expect(productoRepositoryMock.buscarConFiltros).toHaveBeenCalledWith(
        expect.any(Object), 1, 100, {});
  });
});

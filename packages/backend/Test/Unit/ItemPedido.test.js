import { ItemPedido } from "../../Domain/ItemPedido.js";
import { Producto } from "../../Domain/Producto.js";
import { Categoria } from "../../Domain/Categoria.js";
import { Usuario } from "../../Domain/Usuario.js";
import {jest} from "@jest/globals";

describe("ItemPedido", () => {
    const categoria_cocina = new Categoria("Cocina");
    const vendedor1 = new Usuario("Ramiro", "rdisanto@frba.utn.edu.ar", 1156789234, "VENDEDOR", '2025-08-22');
    const producto1 = new Producto(vendedor1, "Servilletas Truchas", "Servilletas de cocina una hoja", [categoria_cocina], 20, "ARS", 5, [], true);
    const producto2 = new Producto(vendedor1, "Servilletas Susex", "Servilletas de cocina doble hoja", [categoria_cocina], 50, "ARS", 10, [], true);

    test("deberia iniciar propiedades correctamente", () => {
        const item = new ItemPedido(producto1, 2, 100);
        expect(item.producto).toBe(producto1);
        expect(item.cantidad).toBe(2);
        expect(item.precioUnitario).toBe(100);
    });

    test("subtotal() deberia retornar cantidad * precioUnitario", () => {
        const item = new ItemPedido(producto1, 3, 50);
        expect(item.subtotal()).toBe(150);
    });

    test("tieneStockSuficiente() deberia llamar a producto.estaDisponible con cantidad", () => {
        jest.spyOn(producto1, "estaDisponible").mockReturnValue(true);
        
        const item = new ItemPedido(producto1, 5, 20);
        expect(item.tieneStockSuficiente()).toBe(true);
        expect(producto1.estaDisponible).toHaveBeenCalledWith(5);
    });

    test("getVendedor() deberia retornar producto.getVendedor()", () => {
        jest.spyOn(producto1, "getVendedor").mockReturnValue("Vendedor1");

        const item = new ItemPedido(producto1, 1, 10);
        expect(item.getVendedor()).toBe("Vendedor1");
        expect(producto1.getVendedor).toHaveBeenCalled();
    });

    test("getNombre() deberia retornar producto.getNombre()", () => {
        jest.spyOn(producto1, "getNombre").mockReturnValue("ProductoX");

        const item = new ItemPedido(producto1, 1, 10);
        expect(item.getNombre()).toBe("ProductoX");
        expect(producto1.getNombre).toHaveBeenCalled();
    });

    test("getProducto() deberia retornar producto", () => {
        const item = new ItemPedido(producto1, 1, 10);
        expect(item.getProducto()).toBe(producto1);
    });

    test("getCantidad() deberia retornar cantidad", () => {
        const item = new ItemPedido(producto1, 7, 10);
        expect(item.getCantidad()).toBe(7);
    });

    test("getProductoId() deberia retornar producto.getId()", () => {
        jest.spyOn(producto1, "getId").mockReturnValue("prod-123");

        const item = new ItemPedido(producto1, 1, 10);
        expect(item.getProductoId()).toBe("prod-123");
        expect(producto1.getId).toHaveBeenCalled();
    });

    test("getPrecioUnitario() deberia retornar precioUnitario", () => {
        const item = new ItemPedido(producto1, 1, 99);
        expect(item.getPrecioUnitario()).toBe(99);
    });
});


import { Pedido } from '../../Domain/Pedido.js';
import { Producto } from '../../Domain/Producto.js';
import { Usuario} from '../../Domain/Usuario.js';
import { Categoria} from '../../Domain/Categoria.js';
import { ItemPedido } from '../../Domain/ItemPedido.js';
import { DireccionEntrega } from '../../Domain/DireccionEntrega.js';
import { CambioEstadoPedido } from '../../Domain/CambioEstadoPedido.js';
import {NoSePuedeCambiarDeEstadoException } from '../../Excepciones/NoSePuedeCambiarDeEstadoException.js';

describe('Verificar pedido', () => {

    const comprador_nuevo = new Usuario("Mora", "mocontreras@frba.utn.edu.ar", 1156789234, "COMPRADOR", '2025-08-22');
    const vendedor1 = new Usuario("Ramiro", "rdisanto@frba.utn.edu.ar", 1156789234, "VENDEDOR", '2025-08-22');
    const categoria_cocina = new Categoria("Cocina");
    const producto1 = new Producto(vendedor1, "Servilletas Truchas", "Servilletas de cocina una hoja", [categoria_cocina], 20, "ARS", 5, [], true);
    const producto2 = new Producto(vendedor1, "Servilletas Susex", "Servilletas de cocina doble hoja", [categoria_cocina], 50, "ARS", 10, [], true);
    const itemPedido1 = new ItemPedido(producto1, 5, producto1.getPrecio());
    const itemPedido2 = new ItemPedido(producto2, 2, producto2.getPrecio());
    const direccion1 = new DireccionEntrega( "Av. Siempre Viva", 742, 1,  "A", "1234", "Ciudad Autonoma de Buenos Aires", "Buenos Aires", "Argentina", -34.6037, -34.6037,);
    const pedido = new Pedido(comprador_nuevo, [itemPedido1, itemPedido2], "ARS" , direccion1);
        
    test('Debería calcular el total como la suma de los subtotales', () => {
        expect(pedido.calcularTotal()).toBe(200);
    });

    test('Debería devolver que la validación del stock de todos los items fue exitosa', () => {
        expect(pedido.validarStock()).toBe(true);
    });

    test('Debería devolver que la validación del stock de todos los items no fue exitosa', () => {
        const itemPedido3 = new ItemPedido(producto1, 6, producto1.getPrecio());
        const pedido_error = new Pedido(comprador_nuevo, [itemPedido1, itemPedido2, itemPedido3], "ARS" , direccion1);
        expect(pedido_error.validarStock()).toBe(false);
    });

    test('Debería actualizarse el estado correctamente', () =>{
        pedido.actualizarEstado("EN_PREPARACION", comprador_nuevo, "El pedido ya fue aprobado, ahora entra en preparación");
        
        const estadoPreparacion = new CambioEstadoPedido("2025-10-02","EN_PREPARACION",pedido,comprador_nuevo, "El pedido ya fue aprobado, ahora entra en preparación");

        expect(pedido.getEstado()).toBe("EN_PREPARACION");
        expect(pedido.getHistorialEstados()).toStrictEqual([estadoPreparacion]);
    });

    test('Debería validar correctamente que se puede cancelar un pedido', () => {
        const resultado = pedido.validarSePuedeCancelar();
        expect(resultado).toBe(true);
    });

    test('Debería validar correctamente que se puede cancelar un pedido', () => {
        pedido.actualizarEstado("ENVIADO", comprador_nuevo, "El pedido ya fue enviado");
        expect(() => { pedido.validarSePuedeCancelar(); }).toThrow(NoSePuedeCambiarDeEstadoException);
    });
});




import { Producto } from '../../Domain/Producto.js';
import { Usuario } from '../../Domain/Usuario.js';
import { Categoria } from '../../Domain/Categoria.js';



describe('Test de la clase producto', () => {
    
    const categoria_cocina = new Categoria("Cocina");
    const vendedor1 = new Usuario("Ramiro", "rdisanto@frba.utn.edu.ar", 1156789234, "VENDEDOR", '2025-08-22');
    const producto1 = new Producto(vendedor1, "Servilletas Truchas", "Servilletas de cocina una hoja", [categoria_cocina], 20, "ARS", 5, [], true);
    const producto2 = new Producto(vendedor1, "Servilletas Susex", "Servilletas de cocina doble hoja", [categoria_cocina], 50, "ARS", 10, [], true);

    test('Aumentar stock de un pedido', () => {
        producto1.aumentarStock(5);
        expect(producto1.stock).toBe(10);
    });

    test('Reducir stock de un pedido', () => {
        producto2.reducirStock(3);
        expect(producto2.stock).toBe(7);
    });

    test('verificar cantidad Disponible', () => {
        expect(producto1.estaDisponible(8)).toBe(true);
        expect(producto2.estaDisponible(15)).toBe(false);
    });

     test('Validar cantidad', () => {
          expect(() => { producto1.validarDisponible(30) }).toThrow('No hay suficiente stock');
    });
     test('Probar que tire excepcion si la cantidad no es adecuada', () => {
          expect(() => { producto1.validarCantidad(-3) }).toThrow('Para conocer si el stock del producto es suficiente, se debe conocer la cantidad solicitad. La misma debe ser un valor mayor a 0');
    });
    
});
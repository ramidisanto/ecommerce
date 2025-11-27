import { EstadoPedido } from "../../Domain/EstadoPedido.js";
import { ItemPedido } from "../../Domain/ItemPedido.js";
import { Pedido } from "../../Domain/Pedido.js";
import { Usuario } from "../../Domain/Usuario.js";
import { Producto } from "../../Domain/Producto.js";
import { FactoryNotificacion } from "../../Domain/FactoryNotificacion.js";
import { DireccionEntrega } from "../../Domain/DireccionEntrega.js";
import { TipoUsuario } from "../../Domain/TipoUsuario.js";
import { PedidoService } from "../../Services/PedidoService.js";
import { jest } from "@jest/globals";

describe('PedidoService', () => {
  let pedidoRepositoryMock;
  let usuarioRepositoryMock;
  let productoRepositoryMock;
  let servicioNotificacionMock;
  let factoryNotificacionMock;
  let pedidoService;

  beforeEach(() => {
    pedidoRepositoryMock = {
      crearPedido: jest.fn(),
      obtenerPedidoPorId: jest.fn(),
      actualizarPedido: jest.fn(),
      obtenerPedidosPorUsuarioId: jest.fn()
    };
    usuarioRepositoryMock = {};
    

    productoRepositoryMock = {
      obtenerProductoPorId: jest.fn(),
      actualizarProducto: jest.fn(),
      obtenerProductosPorIds: jest.fn(),
      actualizarStockEnLote: jest.fn()
    };
    
    servicioNotificacionMock = {
      enviarNotificacion: jest.fn()
    };
    factoryNotificacionMock = {
      crearSegunPedido: jest.fn(),
      crearSegunEstado: jest.fn()
    };

    pedidoService = new PedidoService(
      pedidoRepositoryMock,
      usuarioRepositoryMock,
      productoRepositoryMock,
      servicioNotificacionMock,
      factoryNotificacionMock
    );
  });

  test('deberia crear un pedido correctamente y enviar notificacion', async () => {
    const comprador = { id: 1, nombre: 'Juan' };
    const direccionEntrega = { calle: 'Av. Siempreviva 123' };
    const moneda = 'ARS';

    const item = { productoId: "101", cantidad: 2, precioUnitario: 500 };
    const items = [item];

    const productoMock = {
      _id: "101", 
      validarDisponible: jest.fn(),
      getId: jest.fn().mockReturnValue("101"), 
      getPrecio: jest.fn().mockReturnValue(500)
    };


    productoRepositoryMock.obtenerProductosPorIds.mockResolvedValue([productoMock]);
    
    pedidoRepositoryMock.crearPedido.mockResolvedValue({ 
        comprador, 
        items, 
        moneda, 
        direccionEntrega,
        estado: "PENDIENTE"
    });
    
    factoryNotificacionMock.crearSegunPedido.mockReturnValue({ mensaje: 'Pedido creado' });

    const nuevoPedido = await pedidoService.crearPedido(comprador, items, moneda, direccionEntrega);


    expect(productoRepositoryMock.obtenerProductosPorIds).toHaveBeenCalledWith(["101"]);
    expect(productoMock.validarDisponible).toHaveBeenCalledWith(2);
    
    expect(pedidoRepositoryMock.crearPedido).toHaveBeenCalled();
    

    expect(productoRepositoryMock.actualizarStockEnLote).toHaveBeenCalledWith([
        { productoId: "101", cantidadIncremento: -2 }
    ]);
    
    expect(factoryNotificacionMock.crearSegunPedido).toHaveBeenCalled();
    expect(servicioNotificacionMock.enviarNotificacion).toHaveBeenCalled();
  });

  test('deberia poder cancelar un pedido antes que se haya enviado', async () => {
    const productoMock = { 
        getId: jest.fn().mockReturnValue("102")
    };
    const comprador = { id: 1, nombre: 'Juan' };
    
    const itemPedido = {
        getProductoId: () => "101",
        cantidad: 2
    };

    const pedido = { 
      id : 1,
      getItems: () => [itemPedido], 
      getEstado: () => EstadoPedido.Pendiente,
      getComprador: jest.fn().mockReturnValue(comprador),
      validarSePuedeCancelar: jest.fn(),
      actualizarEstado: jest.fn(),
    };

    pedidoRepositoryMock.obtenerPedidoPorId.mockResolvedValue(pedido);
    
    factoryNotificacionMock.crearSegunEstado = jest.fn().mockReturnValue({ mensaje: 'El Pedido ha sido cancelado' });
    servicioNotificacionMock.enviarNotificacion = jest.fn();

    await pedidoService.cancelarPedido(1, comprador);

    expect(pedido.validarSePuedeCancelar).toHaveBeenCalled();
    expect(pedidoRepositoryMock.actualizarPedido).toHaveBeenCalledWith(pedido);
    
    expect(productoRepositoryMock.actualizarStockEnLote).toHaveBeenCalledWith([
        { productoId: "101", cantidadIncremento: 2 }
    ]);
    
    expect(factoryNotificacionMock.crearSegunPedido).toHaveBeenCalledWith(pedido);
    expect(servicioNotificacionMock.enviarNotificacion).toHaveBeenCalled();
  });

  test(`deberia devolver el historial de pedidos de un usuario`, async () => {
    const usuarioId = 1;

    const pedidos = [
      { 
          id: 1, 
          compradorId: usuarioId, 
          estado: EstadoPedido.Entregado,
          items: [ 
              { producto: 'prod1', cantidad: 1, precioUnitario: 100 }
          ],
          toObject: () => ({ id: 1, compradorId: usuarioId, estado: EstadoPedido.Entregado }) 
      },
      { 
          id: 2, 
          compradorId: usuarioId, 
          estado: EstadoPedido.Cancelado,
          items: [],
          toObject: () => ({ id: 2, compradorId: usuarioId, estado: EstadoPedido.Cancelado })
      }
    ];

    pedidoRepositoryMock.obtenerPedidosPorUsuarioId = jest.fn().mockResolvedValue(pedidos);

    const historial = await pedidoService.obtenerHistorialPedidos(usuarioId);
  
    expect(pedidoRepositoryMock.obtenerPedidosPorUsuarioId).toHaveBeenCalledWith(usuarioId);
    expect(historial[0].total).toBe(100); 
  });

  test('deberia marcar un pedido como enviado y notificar al comprador', async () => {

    const vendedor = { id: 2 , nombre: 'Maria', tipo: TipoUsuario.Vendedor };
    const itemsMock = [{ producto: 101, cantidad: 2, precioUnitario: 500 }]; 
    const comprador = { id: 1, nombre: 'Juan' };
    
    const pedido = { 
      id : 1,
      items: itemsMock, 
      getItems: () => itemsMock, 
      getEstado: () => EstadoPedido.Pendiente,
      getComprador: () => comprador,
      validarSePuedeCancelar: jest.fn(),
      actualizarEstado: jest.fn(),
      toObject: () => ({ id: 1 })
    };

    pedidoRepositoryMock.obtenerPedidoPorId = jest.fn().mockResolvedValue(pedido);
    factoryNotificacionMock.crearSegunEstado = jest.fn().mockReturnValue({ mensaje: 'El Pedido ha sido enviado' });
    factoryNotificacionMock.crearSegunPedido = jest.fn();
    servicioNotificacionMock.enviarNotificacion = jest.fn();

    await pedidoService.marcarPedidoEnviado(1, vendedor);

    expect(pedido.actualizarEstado).toHaveBeenCalledWith(EstadoPedido.Enviado, comprador, "Pedido enviado");
    expect(pedidoRepositoryMock.actualizarPedido).toHaveBeenCalledWith(pedido);
    expect(factoryNotificacionMock.crearSegunPedido).toHaveBeenCalledWith(pedido);
    expect(servicioNotificacionMock.enviarNotificacion).toHaveBeenCalled();
  });
});
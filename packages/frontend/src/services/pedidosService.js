import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL;
/*USUARIO HARDCODEADO */
const HARDCODED_USER_ID = '690bbf9ee29dcdbf52c8ecd1';


export const getPedidosPorUsuario = async (usuarioId = HARDCODED_USER_ID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/usuarios/${usuarioId}/pedidos`);
        return response.data.map(pedido => ({
            ...pedido,
            id: pedido._id || pedido.id,
            comprador: {
                id: pedido.comprador._id || pedido.comprador.id,
                nombre: pedido.comprador.nombre,
                email: pedido.comprador.email,
                telefono: pedido.comprador.telefono,
                tipo: pedido.comprador.tipo,
                fechaAlta: pedido.comprador.fechaAlta
            },
            items: pedido.items.map(item => ({
                ...item,
                producto: {
                    ...item.producto,
                    id: item.producto._id || item.producto.id,
                    vendedorId: item.producto.vendedorId._id || item.producto.vendedorId.id,
                    titulo: item.producto.titulo,
                    descripcion: item.producto.descripcion,
                    categorias: item.producto.categorias,
                    precio: item.producto.precio,
                    moneda: item.producto.moneda,
                    stock: item.producto.stock,
                    fotos: item.producto.fotos,
                    activo: item.producto.activo,
                    ventas: item.producto.ventas
                },
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario
            })),
            total: pedido.total,
            moneda: pedido.moneda,
            direccionEntrega: pedido.direccionEntrega,
            estado: pedido.estado,
            fechaCreacion: pedido.fechaCreacion,
            historialEstados: pedido.historialEstados
        })) || [];
    }
        catch (error) {
            if (error.response && error.response.status === 204) {
            return []; 
        }
        console.error('Error fetching pedidos por usuario:', error);
        
        return [];
    }
};



export const marcarPedidoCancelado = async (pedidoId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/pedido/${pedidoId}`);
        return true;
    }
        catch (error) {
            if (error.response && error.response.status === 204) {
            return []; 
        }
        console.error('Error cancelando pedido:', error);
        
        return [];
    }
};


export const CrearPedido = async (PedidoData) => {
    try { 
        const response = await axios.post(`${API_BASE_URL}/pedido`, PedidoData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        throw error;
    }
};
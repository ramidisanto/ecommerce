import axios from 'axios'; 
const API_BASE_URL = process.env.REACT_APP_API_URL;

const HARDCODED_USER_ID = '690bbf9ee29dcdbf52c8ecd1'; 


export const getVentasPorVendedor = async () => {
    try {
       
        const response = await axios.get(`${API_BASE_URL}/vendedor/${HARDCODED_USER_ID}/ventas`);
        
        let ventas = [];
       
        if (Array.isArray(response.data)) {
            ventas = response.data;
        } else if (response.data.ventas && Array.isArray(response.data.ventas)) {
            ventas = response.data.ventas;
        }
        
        return ventas; 

    } catch (error) {
        console.error('Error fetching ventas:', error);
        throw error;
    } 
};

export const marcarPedidoEnviado = async (pedidoId) => {
    try {
    
        const response = await axios.patch(`${API_BASE_URL}/pedido/${pedidoId}/enviado`);

        return true;

    } catch (error) {
        console.error('Error marcando como enviado:', error);
        throw error;
    } 
};
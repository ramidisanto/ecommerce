import axios from 'axios'; 

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const getProductosPorVendedor = async(vendedorId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/vendedor/${vendedorId}/productos`);
        return response.data.items || [];
    } catch (error) {
        console.error('Error fetching productos por vendedor:', error);
        throw error;
    }   
};

export const getProductosDestacados = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/productos/destacados`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching productos destacados:', error);
        throw error;
    }
};

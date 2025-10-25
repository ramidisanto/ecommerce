import {productos} from '../data/Productos';

const API_BASE_URL = process.env.REACT_APP_API_URL;
export const obtenerProductos = () => new Promise((resolve) => {
    setTimeout(() => {
        resolve(productos);
    }, 5000);
});

export const getProductos = async() => {
    try {
        const response = await axios.get(`${API_BASE_URL}/productos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching productos:', error);
        throw error;
    }   
};
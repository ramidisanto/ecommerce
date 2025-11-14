import axios from 'axios'; 
import  keycloak  from '../Keycloak.js';

const API_BASE_URL = process.env.REACT_APP_API_URL;
//const HARDCODED_USER_ID = '690bbf9ee29dcdbf52c8ecd1'; 

axios.interceptors.request.use(
  config => {
    
    if (keycloak.authenticated) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  }, 
  error => {
    return Promise.reject(error);
  }
);

export const getVentasPorVendedor = async () => {
    try {
       
        const userId = keycloak.tokenParsed.sub; 
        if (!userId) throw new Error("No se encontró el ID del usuario en Keycloak");

        const response = await axios.get(`${API_BASE_URL}/vendedor/${userId}/ventas`);
        
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
    
        await axios.patch(`${API_BASE_URL}/pedido/${pedidoId}/enviado`);

        return true;

    } catch (error) {
        console.error('Error marcando como enviado:', error);
        throw error;
    } 
};
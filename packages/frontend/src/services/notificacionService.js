import axios from 'axios';
import  keycloak  from '../Keycloak.js';


const API_BASE_URL = process.env.REACT_APP_API_URL;
//const HARDCODED_USER_ID = '68f04b23ed48bbdfd154a4f0'; 


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

export const getNotificaciones = async (leida = undefined) => {
    try {

        const userId = keycloak.tokenParsed.sub; 
        if (!userId) throw new Error("No se encontró el ID del usuario en Keycloak");

        const params = {};
        if (leida !== undefined) {
            params.leida = leida;
        }
        
        const response = await axios.get(`${API_BASE_URL}/usuarios/${userId}/notificaciones`, { params });
        
        return response.data.map(notif => ({
            ...notif,
            id: notif._id || notif.id, 
            title: notif.mensaje.substring(0, 20) + '...', 
            message: notif.mensaje,
            creationDate: notif.fechaAlta,
            isRead: notif.leida,
            readDate: notif.fechaLeida
        })) || [];

    } catch (error) {
        if (error.response && error.response.status === 204) {
            return []; 
        }
        console.error('Error fetching notificaciones:', error);
        
        return [];
    }
};


export const marcarNotificacionComoLeida = async (notificacionId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/notificacion/${notificacionId}`);
        
        const notif = response.data;
        return {
            ...notif,
            id: notif._id || notif.id,
            title: notif.mensaje.substring(0, 20) + '...',
            message: notif.mensaje,
            creationDate: notif.fechaAlta,
            isRead: notif.leida,
            readDate: notif.fechaLeida
        };
    } catch (error) {
        console.error('Error marcando notificacion como leida:', error);
        throw error; 
    }
};
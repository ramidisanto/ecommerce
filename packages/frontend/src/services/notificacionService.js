import axios from 'axios'; 
const API_BASE_URL = process.env.REACT_APP_API_URL;
/*USUARIO HARDCODEADO */
const HARDCODED_USER_ID = '690bbf9ee29dcdbf52c8ecd1'; 

/**
 * Obtiene notificaciones del usuario.
 * @param {boolean|undefined} leida - Si true devuelve solo leídas, si false sólo no leídas, si undefined devuelve todas.
 */
export const getNotificaciones = async (leida = undefined) => {
    try {
        const params = {};
        if (leida !== undefined) {
            params.leida = leida;
        }
        
        const response = await axios.get(`${API_BASE_URL}/usuarios/${HARDCODED_USER_ID}/notificaciones`, { params });
        
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

/**
 * Marca una notificación como leída
 * @param {string} notificacionId - ID de la notificación a marcar.
 */

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
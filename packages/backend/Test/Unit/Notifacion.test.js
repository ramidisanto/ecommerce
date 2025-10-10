import { Notificacion } from '../../Domain/Notificacion.js'
import { Usuario } from "../../Domain/Usuario.js";

describe('Notificacion.marcarComoLeida', () => {
    test ('Setear leida en true y setear fechaLeida con la fecha de leida', () =>{
        const datos = {
            usuarioDetino : new Usuario(1, 'facundo', 'facundo@gmail.com', '2954678906', 'COMPRADOR', '2020-05-10'),
            mensaje : 'hola mundo',
            fechaAlta : '2025-09-10',
            leida : false,
            fechaLeida: null
        };
        const notificacion = new Notificacion(datos);
        notificacion.marcarComoLeida();
        expect(notificacion.leida).toBe(true);
        expect(notificacion.fechaLeida).toBeInstanceOf(Date);
        expect(notificacion.fechaLeida).not.toBeNull();
    });
});
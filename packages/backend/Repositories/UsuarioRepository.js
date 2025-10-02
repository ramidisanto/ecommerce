import { UsuarioModel } from "../Schemas/UsuarioSchema.js";

export class UsuarioRepository {

    constructor(){
        this.model = UsuarioModel;
    }

    async exists(id){
        const usuarioDB = await this.model.findById(id);
        return !!usuarioDB;
    }

    

/*  deUsuarioDominioAUsuarioDB(usuario){
        const nuevoUsuario = {
            idComprador: new ObjectId(usuario.getComprador().getId()),
            nombre: usuario.getNombre(),
            email: usuario.getEmail(),
            telefono: usuario.getTelefono(),
            tipo: usuario.getTipo(),
            fechaAlta: usuario.getFechaAlta()
        };
        delete nuevoUsuario.id;
        return nuevoUsuario;
    }

    async deUsuarioDBAUsuarioDominio(usuarioDB){
        const usuario = new Usuario();
        Object.assign(usuario, {
            id: usuarioDB._id.toString(),
            nombre: usuarioDB.nombre,
            email: usuarioDB.email,
            telefono: usuarioDB.telefono,
            tipo: usuarioDB.tipo,
            fechaAlta: usuarioDB.fechaAlta
        });
        return usuario;
    }   

    async obtenerUsuarioPorId(id){
        const usuarioDB = await this.collection.findOne({_id: new ObjectId(id)});
        if (!usuarioDB) {
            throw new Error(`Usuario con id ${id} no encontrado`);
        }   
        return this.deUsuarioDBAUsuarioDominio(usuarioDB);
    }
*/
}
    
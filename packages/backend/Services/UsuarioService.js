import { UsuarioRepository } from "../Repositories/UsuarioRepository.js";

export class UsuarioService {
    usuarioRepository;
    
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;     
    }

    async exists(id) {
        return this.usuarioRepository.exists(id);
    }

}
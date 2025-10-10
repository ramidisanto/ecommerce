import { UsuarioRepository } from "../Repositories/UsuarioRepository.js";

export class UsuarioService {
    usuarioRepository;
    
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;     
    }

    async exists(id) {
        return this.usuarioRepository.exists(id);
    }

    async findById(id) {
        return this.usuarioRepository.findById(id);
    }
}
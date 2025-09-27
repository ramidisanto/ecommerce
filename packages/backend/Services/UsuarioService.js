import { UsuarioRepository } from "../Repositories/UsuarioRepository";

export class UsuarioService {
    UsuarioRepository;
    
    constructor(UsuarioRepository) {
        this.UsuarioRepository = UsuarioRepository;     
    }

    async exists(id) {
        return this.UsuarioRepository.exists(id);
    }

}
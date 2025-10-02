import { UsuarioService } from "../../Services/UsuarioService.js";
import { jest } from "@jest/globals";

describe("UsuarioService", () => {
    let usuarioRepositoryMock;
    let usuarioService;

    beforeEach(() => {
        usuarioRepositoryMock = {
            exists: jest.fn()
        };
        usuarioService = new UsuarioService(usuarioRepositoryMock);
    });

    test("debe llamar a usuarioRepository.exists con el id correcto", async () => {
        usuarioRepositoryMock.exists.mockResolvedValue(true);
        const id = 123;
        await usuarioService.exists(id);
        expect(usuarioRepositoryMock.exists).toHaveBeenCalledWith(id);
    });

    test("debe devolver true cuando usuarioRepository.exists devuelve true", async () => {
        usuarioRepositoryMock.exists.mockResolvedValue(true);
        const resultado = await usuarioService.exists(1);
        expect(resultado).toBe(true);
    });

    test("debe devolver false cuando usuarioRepository.exists devuelve false", async () => {
        usuarioRepositoryMock.exists.mockResolvedValue(false);
        const resultado = await usuarioService.exists(2);
        expect(resultado).toBe(false);
    });

    test("debe propagar errores de usuarioRepository.exists", async () => {
        usuarioRepositoryMock.exists.mockRejectedValue(new Error("Error de BD"));
        await expect(usuarioService.exists(3)).rejects.toThrow("Error de BD");
    });
});
import { crearError } from "../utils/crearError.js";
import { Role } from "../constants/roleConstants.js";
import User from "../models/userModel.js";

export const cambiarAPremiumService = async (usuarioToken) => {

    if (usuarioToken.role === Role.admin) {
        throw crearError(403, "El administrador no tiene plan para cambiar");
    }

    const usuario = await User.findById(usuarioToken.id);
    if (!usuario) {
        throw crearError(404, "Usuario no encontrado");
    }

    if (usuario.plan !== "plus") {
        throw crearError(409, "El usuario ya tiene plan premium");
    }

    usuario.plan = "premium";
    return await usuario.save();
};

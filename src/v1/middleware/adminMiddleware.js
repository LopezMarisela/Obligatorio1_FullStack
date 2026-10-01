import { crearError } from "../utils/crearError.js";
import { Role } from "../constants/roleConstants.js";

export const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return next(crearError(401, "No se recibió un token válido"));
    }

    if (req.user.role !== Role.admin) {
        return next(crearError(403, "No tenés permisos de administrador para realizar esta acción"));
    }

    next();
};
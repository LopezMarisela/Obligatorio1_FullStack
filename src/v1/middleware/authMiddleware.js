import { verifyAccessToken } from "../utils/token.js";
import { crearError } from "../utils/crearError.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(crearError(401, "No se recibió un token válido"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return next(crearError(401, "Token inválido o expirado"));
    }
};
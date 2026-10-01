import { rateLimit } from "express-rate-limit";

const QUINCE_MINUTOS = 15 * 60 * 1000;

export const limitadorGeneral = rateLimit({
    windowMs: QUINCE_MINUTOS,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { mensaje: "Demasiadas solicitudes, intentá de nuevo en unos minutos" },
});

export const limitadorAuth = rateLimit({
    windowMs: QUINCE_MINUTOS,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { mensaje: "Demasiados intentos de autenticación, intentá de nuevo en 15 minutos" },
});

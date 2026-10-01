import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { cambiarAPremiumController } from "../controller/usuarioController.js";

const usuarioRoutes = Router();

usuarioRoutes.use(authMiddleware);

usuarioRoutes.patch("/plan", cambiarAPremiumController);

export default usuarioRoutes;

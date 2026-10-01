import { Router } from "express";
import { registroController, loginController } from "../controller/authController.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import { limitadorAuth } from "../middleware/rateLimitMiddleware.js";
import { registroBodySchema } from "../schemas/registroBodySchema.js";
import { loginBodySchema } from "../schemas/loginBodySchema.js";

const authRoutes = Router();


authRoutes.use(limitadorAuth);

authRoutes.post("/registro", validateRequest(registroBodySchema, "body"), registroController);
authRoutes.post("/login", validateRequest(loginBodySchema, "body"), loginController);

export default authRoutes;
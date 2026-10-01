import { createUserService, loginService } from "../services/authService.js";
import { generarAccessTokenByUser } from "../utils/token.js";

export const registroController = async (req, res) => {
    const user = await createUserService(req.body);
    const token = generarAccessTokenByUser(user);
    return res.status(201).json({ user, token });
};

export const loginController = async (req, res) => {
    const user = await loginService(req.body);
    const token = generarAccessTokenByUser(user);
    return res.status(200).json({ user, token });
};
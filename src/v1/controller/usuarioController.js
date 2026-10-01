import { cambiarAPremiumService } from "../services/usuarioService.js";
import { generarAccessTokenByUser } from "../utils/token.js";

export const cambiarAPremiumController = async (req, res) => {
    const user = await cambiarAPremiumService(req.user);
    const token = generarAccessTokenByUser(user);
    return res.status(200).json({ user, token });
};

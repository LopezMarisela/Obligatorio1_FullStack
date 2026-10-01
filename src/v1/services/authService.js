import { crearError } from "../utils/crearError.js";
import { compararPassword, hashear } from "../utils/validar-password.js";
import User from "../models/userModel.js";

export const getUserByEmailOrUsername = async (identificador) => {
    return await User.findOne({
        $or: [{ email: identificador }, { username: identificador }],
    }).select("+password");
};

export const createUserService = async (data) => {
    const userPorEmail = await User.findOne({ email: data.email });
    if (userPorEmail) {
        throw crearError(409, "Ya existe un usuario registrado con ese email");
    }

    const userPorUsername = await User.findOne({ username: data.username });
    if (userPorUsername) {
        throw crearError(409, "Ya existe un usuario registrado con ese username");
    }

    const hashPassword = await hashear(data.password);

    const nuevoUsuario = {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashPassword,
    };

    return await User.create(nuevoUsuario);
};

export const loginService = async (reqBody) => {
    const errorCredencialInvalida = crearError(401, "Credenciales inválidas");

    const user = await getUserByEmailOrUsername(reqBody.identificador);
    if (!user) {
        throw errorCredencialInvalida;
    }

    const passwordValida = await compararPassword(reqBody.password, user.password);
    if (!passwordValida) {
        throw errorCredencialInvalida;
    }

    return user;
};
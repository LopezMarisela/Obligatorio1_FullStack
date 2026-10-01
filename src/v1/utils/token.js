import jwt from "jsonwebtoken";

const baseOptions = {
    algorithm: "HS256",
    issuer: "bitacora-viajes-api",
    audience: "bitacora-viajes-client",
};

export const generarAccessTokenByUser = (user) => {
    const userToken = {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
    };
    return generateAccessToken(userToken);
};

export const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_ACCESS_SECRET, {
        ...baseOptions,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, baseOptions);
};
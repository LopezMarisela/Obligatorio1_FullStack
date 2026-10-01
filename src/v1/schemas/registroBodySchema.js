import Joi from "joi";

export const registroBodySchema = Joi.object({
    name: Joi.string().min(2).max(60).required().messages({
    "string.empty": "El nombre es obligatorio",
    "any.required": "El nombre es obligatorio",
}),
    username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "El nombre de usuario es obligatorio",
    "any.required": "El nombre de usuario es obligatorio",
    "string.alphanum": "El nombre de usuario solo puede tener letras y números",
}),
    email: Joi.string().email().required().messages({
    "string.empty": "El correo electrónico es obligatorio",
    "any.required": "El correo electrónico es obligatorio",
    "string.email": "El correo electrónico no tiene un formato válido",
}),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        .required()
        .messages({
            "string.empty": "La contraseña es obligatoria",
            "any.required": "La contraseña es obligatoria",
            "string.min": "La contraseña debe tener al menos 8 caracteres",
            "string.pattern.base": "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
        }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "string.empty": "Debés confirmar la contraseña",
        "any.required": "Debés confirmar la contraseña",
        "any.only": "Las contraseñas no coinciden",
    }),
});
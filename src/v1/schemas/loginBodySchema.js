import Joi from "joi";

export const loginBodySchema = Joi.object({
    password: Joi.string().min(3).max(30).required().messages({
        "string.empty": "La contraseña es obligatoria",
        "any.required": "La contraseña es obligatoria",
    }),
    identificador: Joi.alternatives()
        .try(Joi.string().email(), Joi.string().alphanum().min(3))
        .required()
        .messages({
            "alternatives.match": "Ingresá un username o email válido",
            "any.required": "Debés indicar tu username o email",
        }),
});
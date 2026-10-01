import Joi from "joi";

export const crearTipoDeViajeSchema = Joi.object({
    nombre: Joi.string().min(2).max(50).required().messages({
        "string.empty": "El nombre de la categoría es obligatorio",
        "any.required": "El nombre de la categoría es obligatorio",
    }),
    descripcion: Joi.string().max(200).allow("").optional(),
});

export const actualizarTipoDeViajeSchema = Joi.object({
    nombre: Joi.string().min(2).max(50).messages({
        "string.empty": "El nombre de la categoría no puede estar vacío",
    }),
    descripcion: Joi.string().max(200).allow(""),
})
    .min(1)
    .messages({
        "object.min": "Enviar al menos un campo para actualizar",
    });
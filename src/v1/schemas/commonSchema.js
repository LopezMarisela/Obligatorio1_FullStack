import Joi from "joi";

export const objectIdParamSchema = (paramName) =>
    Joi.object({
        [paramName]: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                "string.pattern.base": "El id no tiene un formato válido",
                "any.required": "Falta el id en la URL",
            }),
    });

export const paramsIdTipoViajeSchema = objectIdParamSchema("idTipoViaje");
export const paramsIdViajeSchema = objectIdParamSchema("idViaje");
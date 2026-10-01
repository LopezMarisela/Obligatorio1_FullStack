import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "{{#label}} no tiene un formato de id válido",
});

export const crearViajeSchema = Joi.object({
    titulo: Joi.string().min(2).max(100).required(),
    destino: Joi.string().min(2).max(100).required(),
    fechaInicio: Joi.date().iso().required(),
    fechaFin: Joi.date().iso().min(Joi.ref("fechaInicio")).required().messages({
        "date.min": "fechaFin no puede ser anterior a fechaInicio",
    }),
    notas: Joi.string().max(2000).allow(""),
    calificacion: Joi.number().integer().min(1).max(5),
    tipoDeViaje: objectId.required(),
});


export const actualizarViajeSchema = Joi.object({
    titulo: Joi.string().min(2).max(100),
    destino: Joi.string().min(2).max(100),
    fechaInicio: Joi.date().iso(),
    fechaFin: Joi.date().iso(),
    notas: Joi.string().max(2000).allow(""),
    calificacion: Joi.number().integer().min(1).max(5),
    tipoDeViaje: objectId,
})
    .min(1)
    .messages({
        "object.min": "Enviar al menos un campo para actualizar",
    });


export const listarViajesQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    destino: Joi.string().max(100),
    tipoDeViaje: objectId,
    desde: Joi.date().iso(),
    hasta: Joi.date().iso(),
    calificacionMin: Joi.number().integer().min(1).max(5),
});

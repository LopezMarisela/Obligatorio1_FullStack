import { mensajesJoi } from "../config/joiMessages.js";

export function validateRequest(schema, source = "body") {
    return (req, res, next) => {
        const objetoAValidar =
            source === "params" ? req.params :
            source === "query" ? req.query :
            req.body;

        const { error, value } = schema.validate(objetoAValidar, {
            abortEarly: false,
            messages: mensajesJoi,
            errors: {
                wrap: { label: false },
            },
        });

        if (error) {
            return next(error);
        }

        if (source === "query") {
            req.validatedQuery = value;
        } else if (source === "params") {
            req.params = value;
        } else {
            req.body = value;
        }

        next();
    };
}
const limpiarObjeto = (objeto) => {
    if (Array.isArray(objeto)) {
        objeto.forEach(limpiarObjeto);
        return;
    }
    if (objeto && typeof objeto === "object") {
        for (const clave of Object.keys(objeto)) {
            if (clave.startsWith("$") || clave.includes(".")) {
                delete objeto[clave];
            } else {
                limpiarObjeto(objeto[clave]);
            }
        }
    }
};

export const sanitizeMongoMiddleware = (req, res, next) => {
    limpiarObjeto(req.body);
    limpiarObjeto(req.params);
    next();
};

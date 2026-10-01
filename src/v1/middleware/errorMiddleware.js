export function middlewareErrores(err, req, res, next) {
    if (err.isJoi) {
        const detalle = err.details?.map((d) => d.message).join(", ") || "Datos inválidos";
        return res.status(400).json({ mensaje: detalle });
    }

   
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ mensaje: "El body no es un JSON válido" });
    }
    if (err.type === "entity.too.large") {
        return res.status(413).json({ mensaje: "El body supera el tamaño máximo permitido" });
    }

    if (err.status) {
        return res.status(err.status).json({ mensaje: err.mensaje || err.message });
    }

    if (err.name === "CastError") {
        return res.status(400).json({ mensaje: "Id con formato inválido" });
    }

    if (err.code === 11000) {
        return res.status(409).json({ mensaje: "Ya existe un registro con ese valor único" });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ mensaje: "Datos inválidos" });
    }

    console.error(err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
}
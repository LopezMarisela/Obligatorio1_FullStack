export function crearError(status, mensaje) {
    const error = new Error(mensaje);
    error.status = status;
    error.mensaje = mensaje;
    return error;
}
import { crearError } from "../utils/crearError.js";
import TipoDeViaje from "../models/tipoDeViajeModel.js";
import Viaje from "../models/viajeModel.js";
import { sanitizarTexto } from "../utils/sanitizarTexto.js";

const verificarNombreDisponible = async (nombre, idExcluido = null) => {
    const existente = await TipoDeViaje.findOne({ nombre });
    if (existente && existente._id.toString() !== idExcluido) {
        throw crearError(409, "Ya existe un tipo de viaje con ese nombre");
    }
};

export const crearTipoDeViajeService = async (data) => {
    const nombre = sanitizarTexto(data.nombre);
    await verificarNombreDisponible(nombre);

    const nuevoTipoDeViaje = {
        nombre,
        descripcion: sanitizarTexto(data.descripcion),
    };

    return await TipoDeViaje.create(nuevoTipoDeViaje);
};

export const listarTiposDeViajeService = async () => {
    return await TipoDeViaje.find().sort({ nombre: 1 });
};

export const obtenerTipoDeViajePorIdService = async (id) => {
    const tipoDeViaje = await TipoDeViaje.findById(id);
    if (!tipoDeViaje) {
        throw crearError(404, "Tipo de viaje no encontrado");
    }
    return tipoDeViaje;
};

export const actualizarTipoDeViajeService = async (id, data) => {
    const tipoDeViaje = await obtenerTipoDeViajePorIdService(id);

    if (data.nombre !== undefined) {
        const nombre = sanitizarTexto(data.nombre);
        await verificarNombreDisponible(nombre, id);
        tipoDeViaje.nombre = nombre;
    }
    if (data.descripcion !== undefined) {
        tipoDeViaje.descripcion = sanitizarTexto(data.descripcion);
    }

    return await tipoDeViaje.save();
};

export const eliminarTipoDeViajeService = async (id) => {
    const tipoDeViaje = await obtenerTipoDeViajePorIdService(id);

    const tieneViajes = await Viaje.exists({ tipoDeViaje: id });
    if (tieneViajes) {
        throw crearError(409, "No se puede eliminar un tipo de viaje que tiene viajes asociados");
    }

    await tipoDeViaje.deleteOne();
};

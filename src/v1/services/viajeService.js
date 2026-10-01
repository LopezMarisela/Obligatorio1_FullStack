import { crearError } from "../utils/crearError.js";
import { Role } from "../constants/roleConstants.js";
import Viaje from "../models/viajeModel.js";
import User from "../models/userModel.js";
import TipoDeViaje from "../models/tipoDeViajeModel.js";
import { generarItinerario } from "./iaService.js";
import { obtenerClimaDeViaje } from "./climaService.js";
import { sanitizarTexto } from "../utils/sanitizarTexto.js";

const LIMITE_VIAJES_PLAN_PLUS = 4;

const esAdmin = (usuario) => usuario.role === Role.admin;

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const verificarTipoDeViajeExiste = async (idTipoDeViaje) => {
    const existe = await TipoDeViaje.exists({ _id: idTipoDeViaje });
    if (!existe) {
        throw crearError(400, "El tipo de viaje indicado no existe");
    }
};

const verificarLimiteDePlan = async (usuarioToken) => {
    if (esAdmin(usuarioToken)) return;

    const usuario = await User.findById(usuarioToken.id);
    if (!usuario) {
        throw crearError(401, "El usuario del token ya no existe");
    }

    if (usuario.plan === "plus") {
        const cantidad = await Viaje.countDocuments({ usuario: usuario._id });
        if (cantidad >= LIMITE_VIAJES_PLAN_PLUS) {
            throw crearError(
                403,
                `El plan plus permite hasta ${LIMITE_VIAJES_PLAN_PLUS} viajes. Pasate a premium para cargar viajes ilimitados`
            );
        }
    }
};

export const crearViajeService = async (data, usuarioToken) => {
    await verificarLimiteDePlan(usuarioToken);
    await verificarTipoDeViajeExiste(data.tipoDeViaje);

    const nuevoViaje = {
        titulo: sanitizarTexto(data.titulo),
        destino: sanitizarTexto(data.destino),
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        notas: sanitizarTexto(data.notas),
        calificacion: data.calificacion,
        tipoDeViaje: data.tipoDeViaje,
        usuario: usuarioToken.id,
    };

    const viaje = await Viaje.create(nuevoViaje);
    return await viaje.populate("tipoDeViaje");
};

export const listarViajesService = async (query, usuarioToken) => {
    const { page, limit, destino, tipoDeViaje, desde, hasta, calificacionMin } = query;

    const filtro = {};

    if (!esAdmin(usuarioToken)) {
        filtro.usuario = usuarioToken.id;
    }
    if (destino) {
        filtro.destino = { $regex: escaparRegex(destino), $options: "i" };
    }
    if (tipoDeViaje) {
        filtro.tipoDeViaje = tipoDeViaje;
    }
    if (desde || hasta) {
        filtro.fechaInicio = {};
        if (desde) filtro.fechaInicio.$gte = desde;
        if (hasta) filtro.fechaInicio.$lte = hasta;
    }
    if (calificacionMin) {
        filtro.calificacion = { $gte: calificacionMin };
    }

    const [viajes, total] = await Promise.all([
        Viaje.find(filtro)
            .sort({ fechaInicio: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("tipoDeViaje"),
        Viaje.countDocuments(filtro),
    ]);

    return {
        viajes,
        paginacion: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const obtenerViajePorIdService = async (id, usuarioToken) => {
    const filtro = { _id: id };
    if (!esAdmin(usuarioToken)) {
        filtro.usuario = usuarioToken.id;
    }

    const viaje = await Viaje.findOne(filtro).populate("tipoDeViaje");
    if (!viaje) {
        throw crearError(404, "Viaje no encontrado");
    }
    return viaje;
};

export const actualizarViajeService = async (id, data, usuarioToken) => {
    const viaje = await obtenerViajePorIdService(id, usuarioToken);

    if (data.tipoDeViaje !== undefined) {
        await verificarTipoDeViajeExiste(data.tipoDeViaje);
    }

    const fechaInicio = data.fechaInicio ?? viaje.fechaInicio;
    const fechaFin = data.fechaFin ?? viaje.fechaFin;
    if (new Date(fechaFin) < new Date(fechaInicio)) {
        throw crearError(400, "fechaFin no puede ser anterior a fechaInicio");
    }

    const camposEditables = ["titulo", "destino", "fechaInicio", "fechaFin", "notas", "calificacion", "tipoDeViaje"];
    for (const campo of camposEditables) {
        if (data[campo] !== undefined) {
            viaje[campo] = sanitizarTexto(data[campo]);
        }
    }

    await viaje.save();
    return await viaje.populate("tipoDeViaje");
};

export const generarItinerarioViajeService = async (id, usuarioToken) => {

    const viaje = await obtenerViajePorIdService(id, usuarioToken);

    const { itinerario, generadoPorIA } = await generarItinerario(viaje);

    if (generadoPorIA) {
        viaje.itinerarioSugerido = itinerario;
        await viaje.save();
    }

    return { itinerario, generadoPorIA };
};

export const obtenerClimaViajeService = async (id, usuarioToken) => {

    const viaje = await obtenerViajePorIdService(id, usuarioToken);
    return await obtenerClimaDeViaje(viaje);
};

export const eliminarViajeService = async (id, usuarioToken) => {
    const viaje = await obtenerViajePorIdService(id, usuarioToken);
    await viaje.deleteOne();
};

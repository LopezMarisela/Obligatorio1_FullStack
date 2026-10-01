import {
    crearViajeService,
    listarViajesService,
    obtenerViajePorIdService,
    actualizarViajeService,
    eliminarViajeService,
    generarItinerarioViajeService,
    obtenerClimaViajeService,
} from "../services/viajeService.js";

export const crearViajeController = async (req, res) => {
    const viaje = await crearViajeService(req.body, req.user);
    return res.status(201).json(viaje);
};

export const listarViajesController = async (req, res) => {
    const resultado = await listarViajesService(req.validatedQuery, req.user);
    return res.status(200).json(resultado);
};

export const obtenerViajePorIdController = async (req, res) => {
    const { idViaje } = req.params;
    const viaje = await obtenerViajePorIdService(idViaje, req.user);
    return res.status(200).json(viaje);
};

export const actualizarViajeController = async (req, res) => {
    const { idViaje } = req.params;
    const viaje = await actualizarViajeService(idViaje, req.body, req.user);
    return res.status(200).json(viaje);
};

export const generarItinerarioController = async (req, res) => {
    const { idViaje } = req.params;
    const resultado = await generarItinerarioViajeService(idViaje, req.user);
    // 200 aunque la IA haya fallado: el fallback es una respuesta válida (generadoPorIA: false).
    return res.status(200).json(resultado);
};

export const obtenerClimaController = async (req, res) => {
    const { idViaje } = req.params;
    const clima = await obtenerClimaViajeService(idViaje, req.user);
    return res.status(200).json(clima);
};

export const eliminarViajeController = async (req, res) => {
    const { idViaje } = req.params;
    await eliminarViajeService(idViaje, req.user);
    return res.status(204).send();
};

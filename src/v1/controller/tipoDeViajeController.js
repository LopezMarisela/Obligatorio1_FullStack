import {
    crearTipoDeViajeService,
    listarTiposDeViajeService,
    obtenerTipoDeViajePorIdService,
    actualizarTipoDeViajeService,
    eliminarTipoDeViajeService,
} from "../services/tipoDeViajeService.js";

export const crearTipoDeViajeController = async (req, res) => {
    const tipoDeViaje = await crearTipoDeViajeService(req.body);
    return res.status(201).json(tipoDeViaje);
};

export const listarTiposDeViajeController = async (req, res) => {
    const tiposDeViaje = await listarTiposDeViajeService();
    return res.status(200).json(tiposDeViaje);
};

export const obtenerTipoDeViajePorIdController = async (req, res) => {
    const { idTipoViaje } = req.params;
    const tipoDeViaje = await obtenerTipoDeViajePorIdService(idTipoViaje);
    return res.status(200).json(tipoDeViaje);
};

export const actualizarTipoDeViajeController = async (req, res) => {
    const { idTipoViaje } = req.params;
    const tipoDeViaje = await actualizarTipoDeViajeService(idTipoViaje, req.body);
    return res.status(200).json(tipoDeViaje);
};

export const eliminarTipoDeViajeController = async (req, res) => {
    const { idTipoViaje } = req.params;
    await eliminarTipoDeViajeService(idTipoViaje);
    return res.status(204).send();
};
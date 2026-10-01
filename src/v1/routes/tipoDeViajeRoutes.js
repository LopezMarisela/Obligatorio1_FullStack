import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
    crearTipoDeViajeSchema,
    actualizarTipoDeViajeSchema,
} from "../schemas/tipoDeViajeBodySchema.js";
import { paramsIdTipoViajeSchema } from "../schemas/commonSchema.js";
import {
    crearTipoDeViajeController,
    listarTiposDeViajeController,
    obtenerTipoDeViajePorIdController,
    actualizarTipoDeViajeController,
    eliminarTipoDeViajeController,
} from "../controller/tipoDeViajeController.js";

const tipoDeViajeRoutes = Router();


tipoDeViajeRoutes.use(authMiddleware);


tipoDeViajeRoutes.get("/", listarTiposDeViajeController);
tipoDeViajeRoutes.get(
    "/:idTipoViaje",
    validateRequest(paramsIdTipoViajeSchema, "params"),
    obtenerTipoDeViajePorIdController
);


tipoDeViajeRoutes.post(
    "/",
    adminMiddleware,
    validateRequest(crearTipoDeViajeSchema, "body"),
    crearTipoDeViajeController
);
tipoDeViajeRoutes.patch(
    "/:idTipoViaje",
    adminMiddleware,
    validateRequest(paramsIdTipoViajeSchema, "params"),
    validateRequest(actualizarTipoDeViajeSchema, "body"),
    actualizarTipoDeViajeController
);
tipoDeViajeRoutes.delete(
    "/:idTipoViaje",
    adminMiddleware,
    validateRequest(paramsIdTipoViajeSchema, "params"),
    eliminarTipoDeViajeController
);

export default tipoDeViajeRoutes;
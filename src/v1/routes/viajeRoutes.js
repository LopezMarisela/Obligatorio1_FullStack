import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
    crearViajeSchema,
    actualizarViajeSchema,
    listarViajesQuerySchema,
} from "../schemas/viajeBodySchema.js";
import { paramsIdViajeSchema } from "../schemas/commonSchema.js";
import {
    crearViajeController,
    listarViajesController,
    obtenerViajePorIdController,
    actualizarViajeController,
    eliminarViajeController,
    generarItinerarioController,
    obtenerClimaController,
} from "../controller/viajeController.js";

const viajeRoutes = Router();


viajeRoutes.use(authMiddleware);

viajeRoutes.get("/", validateRequest(listarViajesQuerySchema, "query"), listarViajesController);
viajeRoutes.get("/:idViaje", validateRequest(paramsIdViajeSchema, "params"), obtenerViajePorIdController);
viajeRoutes.post("/", validateRequest(crearViajeSchema, "body"), crearViajeController);
viajeRoutes.patch(
    "/:idViaje",
    validateRequest(paramsIdViajeSchema, "params"),
    validateRequest(actualizarViajeSchema, "body"),
    actualizarViajeController
);
viajeRoutes.post(
    "/:idViaje/itinerario",
    validateRequest(paramsIdViajeSchema, "params"),
    generarItinerarioController
);
viajeRoutes.get(
    "/:idViaje/clima",
    validateRequest(paramsIdViajeSchema, "params"),
    obtenerClimaController
);
viajeRoutes.delete("/:idViaje", validateRequest(paramsIdViajeSchema, "params"), eliminarViajeController);

export default viajeRoutes;

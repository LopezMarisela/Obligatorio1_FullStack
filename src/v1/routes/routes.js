import { Router } from "express";
import authRoutes from "./authRoutes.js";
import tipoDeViajeRoutes from "./tipoDeViajeRoutes.js";
import viajeRoutes from "./viajeRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";

const v1Routes = Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use("/tipos-de-viaje", tipoDeViajeRoutes);
v1Routes.use("/viajes", viajeRoutes);
v1Routes.use("/usuarios", usuarioRoutes);

export default v1Routes;
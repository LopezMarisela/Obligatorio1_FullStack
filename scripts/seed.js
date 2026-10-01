import "dotenv/config";
import mongoose from "mongoose";
import { connectMongo } from "../src/v1/config/mongo.config.js";
import User from "../src/v1/models/userModel.js";
import TipoDeViaje from "../src/v1/models/tipoDeViajeModel.js";
import { Role } from "../src/v1/constants/roleConstants.js";
import { hashear } from "../src/v1/utils/validar-password.js";

const CATEGORIAS_INICIALES = [
    { nombre: "Aventura", descripcion: "Trekking, montaña, deportes extremos y naturaleza" },
    { nombre: "Playa", descripcion: "Sol, mar y descanso en la costa" },
    { nombre: "Cultural", descripcion: "Museos, historia, arquitectura y ciudades" },
    { nombre: "Gastronómico", descripcion: "Viajes pensados alrededor de la comida y la bebida" },
    { nombre: "Escapada", descripcion: "Viajes cortos de fin de semana" },
    { nombre: "Negocios", descripcion: "Viajes de trabajo, congresos y conferencias" },
];

const crearAdmin = async () => {
    const { ADMIN_NAME, ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    const existente = await User.findOne({
        $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }],
    });
    if (existente) {
        console.log(`- Admin: ya existe un usuario con ese email o username (${existente.username}), no se crea`);
        return;
    }

    await User.create({
        name: ADMIN_NAME || "Administrador",
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: await hashear(ADMIN_PASSWORD),
        role: Role.admin,
    });
    console.log(`- Admin: creado (${ADMIN_USERNAME} / ${ADMIN_EMAIL})`);
};

const crearCategorias = async () => {
    let creadas = 0;
    for (const categoria of CATEGORIAS_INICIALES) {
        const existe = await TipoDeViaje.exists({ nombre: categoria.nombre });
        if (!existe) {
            await TipoDeViaje.create(categoria);
            creadas++;
        }
    }
    console.log(`- Categorías: ${creadas} creadas, ${CATEGORIAS_INICIALES.length - creadas} ya existían`);
};

const main = async () => {
    const faltantes = ["ADMIN_USERNAME", "ADMIN_EMAIL", "ADMIN_PASSWORD"].filter((v) => !process.env[v]);
    if (faltantes.length) {
        console.error(`Faltan variables en el .env: ${faltantes.join(", ")}`);
        process.exit(1);
    }

    await connectMongo();
    console.log("Ejecutando seed...");

    try {
        await crearAdmin();
        await crearCategorias();
        console.log("Seed terminado");
    } catch (error) {
        console.error("Error en el seed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

main();

import express from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import { connectMongo } from "./src/v1/config/mongo.config.js";
import apiRoutes from "./src/v1/routes/index.js";
import { middlewareErrores } from "./src/v1/middleware/errorMiddleware.js";
import { limitadorGeneral } from "./src/v1/middleware/rateLimitMiddleware.js";
import { sanitizeMongoMiddleware } from "./src/v1/middleware/sanitizeMongoMiddleware.js";
import { crearError } from "./src/v1/utils/crearError.js";

connectMongo();

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

app.use(limitadorGeneral);

app.use(express.json({ limit: "10kb" }));

app.use(sanitizeMongoMiddleware);

// Ruta raíz para verificar rápido que la API está publicada y respondiendo.
app.get("/", (req, res) => {
    res.status(200).json({ mensaje: "API Bitácora de Viajes", version: "v1", baseUrl: "/api/v1" });
});

app.use("/api", apiRoutes);

app.use((req, res, next) => {
    next(crearError(404, "Ruta no encontrada"));
});


app.use(middlewareErrores);

// En Vercel no se llama a listen: la plataforma importa la app exportada y la ejecuta como función serverless.
if (!process.env.VERCEL) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port}`);
    });
}

export default app;
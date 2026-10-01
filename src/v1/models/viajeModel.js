import mongoose from "mongoose";

const viajeSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true,
        },
        destino: {
            type: String,
            required: true,
            trim: true,
        },
        fechaInicio: {
            type: Date,
            required: true,
        },
        fechaFin: {
            type: Date,
            required: true,
        },
        notas: {
            type: String,
            trim: true,
        },
        calificacion: {
            type: Number,
            min: 1,
            max: 5,
        },

        itinerarioSugerido: {
            type: String,
        },
        tipoDeViaje: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TipoDeViaje",
            required: true,
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

viajeSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Viaje = mongoose.model("Viaje", viajeSchema);

export default Viaje;

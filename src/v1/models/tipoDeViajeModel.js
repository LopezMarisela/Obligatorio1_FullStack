import mongoose from "mongoose";

const tipoDeViajeSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    descripcion: {
        type: String,
        required: false,
        trim: true,
    },
});

tipoDeViajeSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const TipoDeViaje = mongoose.model("TipoDeViaje", tipoDeViajeSchema);

export default TipoDeViaje;
import mongoose from "mongoose";
import { Role, Roles } from "../constants/roleConstants.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: Roles,
            default: Role.usuario,
        },
        plan: {
            type: String,
            enum: ["plus", "premium"],
            default: "plus",
        },
    },
);

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

const User = mongoose.model("User", userSchema);

export default User;
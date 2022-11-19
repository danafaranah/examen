import mongoose from "mongoose";
import bcrypt from "bcrypt"
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "El campo name es obligatorio"],
    },
    lastName: {
        type: String,
        required: [true, "El campo name es obligatorio"],
    },
    email: {
        type: String,
        required: [true, "El campo name es obligatorio"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "El campo password es obligatorio"],
    },
}, {
    timestamps: true
});

//Encriptar contraseña

userSchema.methods.matchPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

export const userModel = model("user", userSchema)
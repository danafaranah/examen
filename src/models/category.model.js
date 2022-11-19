import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const categorySchema = new Schema({
        name: {
            type: String,
            required: [true, "El campo nombre es obligatorio"],
        },
        description: {
            type: String,
            required: [true, "El campo descripcion es obligatorio"],

        },
        imgUrl: {
            type: String,
            default: null,
        },

        public_id: String,
    },

    { timestamps: true }
);

categorySchema.methods.setImg = function setImg({ secure_url, public_id }) {
    this.imgUrl = secure_url;
    this.public_id = public_id;
};

export const categoryModel = model("category", categorySchema);
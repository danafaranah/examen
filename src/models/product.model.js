import { Schema, model } from "mongoose";

const productSchema = new Schema({
    imgUrl: {
        type: String,
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        min: [0, "El puntaje mínimo que puede ingresar es 0"],
        max: [5, "El puntaje máximo es de 5"],
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },

    stock: {
        type: Number,
    },

    public_id: String,
});

productSchema.methods.setImg = function setImg({ secure_url, public_id }) {
    this.imgUrl = secure_url;
    this.public_id = public_id;
};

export const productModel = model("product", productSchema);
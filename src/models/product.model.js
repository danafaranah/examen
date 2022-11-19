import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        min: 0,
        max: [5, "El puntaje máximo es de 5"],
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
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
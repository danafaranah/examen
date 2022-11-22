import { Schema, model } from "mongoose";

const orderSchema = new Schema({
        product: {
            type: Schema.Types.ObjectId,
            required: [true, "El campo product es obligatorio"],
        },
        quantity: {
            type: Number,
            required: [true, "El campo quantity es obligatorio"],
        },
        user: {
            type: Schema.Types.ObjectId,
        },
        total: {
            type: Number,
        },
    },

    { timestamps: true }
);

export const orderModel = model("order", orderSchema);
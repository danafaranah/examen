import {
    deleteImageToCloudinary,
    uploadImageToCloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/Response.js";
import { orderModel } from "../models/order.model.js";
import { productModel } from "../models/product.model.js";

const orderCtrl = {};

orderCtrl.getOrder = async(req, res) => {
    try {
        const orders = await orderModel.find();
        response(res, 200, true, orders, "Lista de Facturas");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};
orderCtrl.getOrderById = async(req, res) => {
    try {
        const { id } = req.params;
        const order = await orderModel.findById(id);

        if (!order) {
            return response(res, 404, false, "", "Factura no encontrada");
        }

        response(res, 200, true, order, "Factura encontrada");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};
orderCtrl.addOrder = async(req, res) => {
    try {
        const { product, quantity } = req.body;
        var { total } = orderModel;
        const productExistence = await productModel.findById(req.body.product);
        var disponibilty = productExistence.stock;

        if (!productExistence) {
            return response(
                res,
                404,
                false,
                "El id ingresado no coincide con ningún producto existente"
            );
        }

        if (quantity > disponibilty) {
            return response(
                res,
                400,
                false,
                "",
                "La cantidad ingresada es mayor a los productos disponibles en stock"
            );
        }

        total = productExistence.price * quantity;
        disponibilty = disponibilty - quantity;

        const newOrder = new orderModel({
            product,
            quantity,
            user: req.userId,
            total,
        });

        await productExistence.updateOne({ stock: disponibilty });
        await orderModel.create(newOrder);
        response(res, 201, true, newOrder, "Categoría agregada con éxito");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

orderCtrl.deleteOrder = async(req, res) => {
    try {
        const { id } = req.params;
        const order = await orderModel.findById(id);
        const producto = order.product;
        const quantity = order.quantity;

        var disponibilty = producto.stock;

        if (!order) {
            return response(res, 404, false, "", "Factura no encontrada");
        }
        disponibilty = disponibilty + quantity;

        await producto.updateOne({ stock: disponibilty });
        await order.deleteOne();
        response(res, 200, true, "", "Factura eliminada con éxito");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};
orderCtrl.updateOrder = async(req, res) => {
    try {
        //Producto Antes de Actualizar
        const { id } = req.params;
        const order = await orderModel.findById(id);
        const { product, quantity } = order;
        var oldStock = product.stock;

        //Producto a Actualizar
        const newProduct = await productModel.findById(req.body.product);
        var newStock = newProduct.stock;
        const newQuantity = req.body.quantity;

        if (!order) {
            return response(res, 404, false, "", "Factura no encontrada");
        }

        if (!product) {
            return response(
                res,
                404,
                false,
                "",
                "El id ingresado para el producto no coincide con ningún registro"
            );
        }

        if (product.id === newProduct) {
            var newOldStock = oldStock + quantity - newQuantity;

            if (newOldStock < newQuantity) {
                return response(
                    res,
                    400,
                    false,
                    "",
                    "La cantidad ingresada es mayor que la cantidad del producto en stock"
                );
            }

            return (total = product.price * newOldStock);
        }

        var refreshStock = oldStock + quantity;
        total = newProduct.price * newStock;

        await product.updateOne({ stock: refreshStock });
        await order.updateOne(req.body);
        response(res, 200, true, order, "Factura actualizada con éxito");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

export default orderCtrl;
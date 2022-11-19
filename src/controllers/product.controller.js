import {
    deleteImageToCloudinary,
    uploadImageToCloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/Response.js";
import { productModel } from "../models/product.model.js";

const productCtrl = {};

productCtrl.getProducts = async(req, res) => {
    try {
        const products = await productModel.find();
        if (!products) {
            return response(res, 404, false, "", "No existen productos");
        }
        response(res, 200, true, products, "Lista de los productos");
    } catch (error) {
        response(res, false, "", error.message);
    }
};
productCtrl.getProductsById = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);

        if (!product) {
            return response(res, 404, false, "", "Producto no encontrado");
        }
        response(res, 200, true, product, "Producto encontrado");
    } catch (error) {
        response(res, false, "", error.message);
    }
};

productCtrl.addProduct = async(req, res) => {
    try {
        const { name, description, rate, category } = req.body;
        const newProduct = new productModel({
            name,
            description,
            rate,
            category,
        });

        if (category) {
            return response(res, 404, false, "", "Categoría no encontrada");
        }
        if (req.file) {
            const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
            newPost.setImg({ secure_url, public_id });
        }

        await productModel.create(newProduct);
        response(res, 201, true, newProduct, "Producto creado");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

productCtrl.deleteProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const product = productModel.findById(id);
        if (!product) {
            response(res, 404, false, "", "No se encontró el producto");
        }

        if (product.public_id) {
            if (req.file) {
                const { secure_url, public_id } = await uploadImageToCloudinary(
                    req.file
                );
                newPost.setImg({ secure_url, public_id });
            }
        }
        await product.deleteOne();
        response(res, 200, true, "", "Producto eliminado");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

productCtrl.updateProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return response(res, 404, false, "", "Producto no encontrado");
        }

        if (req.file) {
            if (product.public_id) {
                await deleteImageToCloudinary(product.public_id);
            }
            const { img_Url, public_id } = await uploadImageToCloudinary(req.file);
            product.setImg({ img_Url, public_id });

            await product.save();
        }

        await product.updateOne(req.body);
        response(res, 200, true, product, "Producto actualizado");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

export default productCtrl;
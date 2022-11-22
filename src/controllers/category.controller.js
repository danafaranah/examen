import {
    deleteImageToCloudinary,
    uploadImageToCloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/Response.js";
import { categoryModel } from "../models/category.model.js";
import { productModel } from "../models/product.model.js";

const categoryCtrl = {};

categoryCtrl.getCategory = async(req, res) => {
    try {
        const categories = await categoryModel.find();
        response(res, 200, true, categories, "Lista de Categorías");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};
categoryCtrl.getCategoryById = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        const producto = await productModel({ category: id });

        if (!category) {
            return response(res, 404, false, "", "Categoría no encontrada");
        }

        response(
            res,
            200,
            true, {...category.toJSON(), producto },
            "Categoría encontrada"
        );
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};
categoryCtrl.addCategory = async(req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new categoryModel({
            name,
            description,
            user: req.userId,
        });

        if (req.file) {
            const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
            newCategory.setImg({ secure_url, public_id });
        }

        await categoryModel.create(newCategory);
        response(res, 201, true, newCategory, "Categoría agregada con éxito");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

categoryCtrl.deleteCategory = async(req, res) => {
    try {
        const { id } = req.params;

        const category = await categoryModel.findById(req.body.id);

        const producto = await productModel.findOne({ category: id });

        if (!category) {
            return response(res, 404, false, "", "Categoría no encontrada");
        }

        if (producto) {
            return response(
                res,
                409,
                false,
                "",
                "No puedes eliminar esta categoría porque tiene productos asociados a ella."
            );
        }

        if (category.public_id) {
            await deleteImageToCloudinary(category.public_id);
        }

        await category.deleteOne();
        response(res, 200, true, "", "Categoría eliminada con éxito");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};
categoryCtrl.updateCategory = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(req.body.id);

        if (!category) {
            return response(res, 404, false, "", "Categoría no encontrada");
        }

        if (req.file) {
            if (category.public_id) {
                await deleteImageToCloudinary(category.public_id);
            }

            const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
            category.setImg({ secure_url, public_id });

            await category.save();
        }

        await category.updateOne(req.body);
        response(res, 200, true, category, "Categoría actualizada con éxito");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

export default categoryCtrl;
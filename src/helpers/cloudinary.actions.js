import cloudinary from "./cloudinary.js";
import { deleteImage } from "./deleteImg.js";

export const uploadImageToCloudinary = async(file) => {
    try {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path);
        deleteImage(file.filename)
        return {
            secure_url,
            public_id,
        };
    } catch (error) {
        console.log("error al ejecutar uploadImageToCloudinary" + error.message);
    }
};

export const deleteImageToCloudinary = async(public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id)
    } catch (error) {
        console.log("error al ejecutar deleteImageToCloudinary" + error.message);
    }
}
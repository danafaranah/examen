import { Router } from "express";
import productCtrl from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/imgUpload.js";

const route = Router()

route.get("/", productCtrl.getProducts);
route.get("/:id", productCtrl.getProductsById);
route.post("/", verifyToken, upload.single("img"), productCtrl.addProduct);
route.delete("/:id", verifyToken, productCtrl.deleteProduct);
route.put(
    "/:id",
    verifyToken,
    upload.single("img"),
    productCtrl.updateProduct
);

export default route;
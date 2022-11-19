import { Router } from "express";
import categoryCtrl from "../controllers/category.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/imgUpload.js";

const route = Router();

route.get("/", categoryCtrl.getCategory);
route.get("/:id", categoryCtrl.getCategoryById);
route.post("/", verifyToken, upload.single("img"), categoryCtrl.addCategory);
route.delete("/:id", verifyToken, categoryCtrl.deleteCategory);
route.put(
    "/:id",
    verifyToken,
    upload.single("img"),
    categoryCtrl.updateCategory
);

export default route;
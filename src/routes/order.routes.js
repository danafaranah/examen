import { Router } from "express";
import orderCtrl from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.js";

const route = Router();

route.get("/", orderCtrl.getOrder);
route.get("/:id", orderCtrl.getOrderById);
route.post("/", verifyToken, orderCtrl.addOrder);
route.delete("/:id", verifyToken, orderCtrl.deleteOrder);
route.put("/:id", verifyToken, orderCtrl.updateOrder);

export default route;
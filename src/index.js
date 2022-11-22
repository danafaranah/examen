import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDb } from "./database.js";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

//Rutas

import categoryRoutes from "./routes/category.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";

connectDb();

const __filename = fileURLToPath(
    import.meta.url);

const __dirname = dirname(__filename);

const app = express();

app.set("port", process.env.PORT);
app.use("/public", express.static(__dirname + "/storage/imgs"));
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/category", categoryRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);

app.listen(app.get("port"), () => {
    console.log("Server on Port", app.get("port"));
});
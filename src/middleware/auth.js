import jwt from "jsonwebtoken";
import { response } from "../helpers/Response.js";
import { userModel } from "../models/user.model.js";

const messageNoAuth = (res) => {
    response(res, 401, false, "", "No estás autorizado para ingresar ");
};
export const verifyToken = async(req, res, next) => {
    let token = null;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.KEYWORD_TOKEN, async(err, payload) => {
            if (err) {
                return messageNoAuth(res);
            }

            const user = await userModel.findById({ _id: payload.user });

            if (!user) {
                return messageNoAuth(res);
            }
            req.userId = payload.user;
            next();
        });
    }

    if (!token) {
        return messageNoAuth(res);
    }
};
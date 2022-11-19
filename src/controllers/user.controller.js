import { encryptPassword } from "../helpers/encryptPassword.js";
import { generateToken } from "../helpers/generateToken.js";
import { response } from "../helpers/Response.js";
import { userModel } from "../models/user.model.js";

const userCtrl = {};

userCtrl.register = async(req, res) => {
    try {
        const { email, password, name, lastName } = req.body;
        const user = await userModel.findOne({ email });

        if (user) {
            return response(
                res,
                409,
                false,
                "",
                "El correo ya existe en otro registro"
            );
        }

        const passwordEncrypt = encryptPassword(password);
        const newUser = new userModel({ email, password: passwordEncrypt, name, lastName });
        await newUser.save();
        const token = generateToken({ user: newUser._id });

        response(
            res,
            201,
            true, {...newUser._doc, password: null, token },
            "Usuario creado con éxito"
        );

    } catch (error) {
        response(res, 500, false, null, error.message);
    }
};

userCtrl.login = async(req, res) => {
    try {
        const { password, email } = req.body;
        const user = await userModel.findOne({ email });

        if (user && user.matchPassword(password)) {
            const token = generateToken({ user: user._id });
            return response(
                res,
                200,
                true, {...user.toJSON(), password: null, token },
                "Bienvenido"
            );
        }

        response(res, 400, false, "", "Email o Password incorrectos");
    } catch (error) {
        response(res, 500, false, null, error.message);
    }
};

export default userCtrl;
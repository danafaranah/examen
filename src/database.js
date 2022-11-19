import mongoose from 'mongoose';


export const connectDb = async() => {
    try {
        const db = await mongoose.connect("mongodb+srv://dana:1234@cluster0.fn9p6zs.mongodb.net/virtualStore");
        console.log(`Base de datos conectada ${db.connection.name}`)
    } catch (error) {

        console.log(`error al conectar a la base de datos ${error.message}`);
    }
};
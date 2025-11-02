import mongoose from "mongoose"

// function to connect to mongodb
export const connectDb = async () => {
    try {
        mongoose.connection.on('connected',()=>console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.log(error);
    }
}
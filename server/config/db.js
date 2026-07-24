import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('Database Connected');
    })

    // Kevalam MONGODB_URI mathrame pass cheyandi
    await mongoose.connect(`${process.env.MONGODB_URI}`)
}

export default connectDB;
import mongoose from "mongoose";

const mongourl = process.env.MONGO_URI;


export const connectDb =() => {
    mongoose.connect(mongourl).then(() => {
        console.log("Database connected")
    }).catch((err) => {
        console.log('Error in connecting to database: ', err)
    })
}



const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected Successfully");
    } catch (err) {
        console.log("Error while connecting to database" , err.message);
        process.exit(0);
    }
}


module.exports = connectDB;

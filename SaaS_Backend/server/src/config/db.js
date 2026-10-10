const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('MongoDB Connected Successfully.');
    } catch(err){
        console.error('MongoDB connection error.', err);
        process.exit();
    }
};

module.exports = connectDB;
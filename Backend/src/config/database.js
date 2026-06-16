const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

async function connectDB() {
   
    try {
          await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
      console.log('Error connecting to MongoDB:', error);
    }
}

module.exports = connectDB;
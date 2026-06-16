const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Name is required'],
        unique: true},
     role:{
        type: String,
        enum: ['admin', 'author'],
        default: 'author',
        required: true
    },  
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is required']
    },
    password: {
        type: String,
        required:true,    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
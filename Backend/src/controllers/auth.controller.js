const userModel = require('../models/user.model');
const blocklistModel = require('../models/blocklist.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');

// /**
//  * @route POST /api/auth/register
//  * @desc Register a new user
//  * @access Public
//  */

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'please provide all required fields  ' });
        }
        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

        /** If a user with the same username or email already exists,  */
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ username, email, password: hashedPassword });
        await newUser.save();


        const token = jwt.sign({
            userId: newUser._id
        },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });

        res.cookie('token', token);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// /**
//  * @route POST /api/auth/login
//  * @desc login user
//  * @access Public
//  */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'please provide all required fields  ' });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token);
        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// /**
//  * @route POST /api/auth/logout
//  * @desc logout user
//  * @access Public
//  */
const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }
        await blocklistModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getmecontroller = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getmecontroller

}
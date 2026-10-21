const jwt = require('jsonwebtoken');
const blocklistModel = require('../models/blocklist.model');

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = req.cookies?.token || bearerToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const isBlocked = await blocklistModel.findOne({ token });
        if (isBlocked) {
            return res.status(401).json({ message: 'Token is blocked' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        if (decoded.userId && !req.user.id) {
            req.user.id = decoded.userId;
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authUser;
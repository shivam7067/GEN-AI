const jwt=require('jsonwebtoken');
const blocklistModel = require('../models/blocklist.model');


const authUser = async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    
    const isBlocked = await blocklistModel.findOne({ token });
    if (isBlocked) {
        return res.status(401).json({ message: 'token is blocked' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message:'Unauthorized'});
    }
}

module.exports = authUser;
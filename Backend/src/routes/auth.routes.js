const {Router} = require('express');
const authRouter = Router();
const authcontroller = require('../controllers/auth.controller');
const authmiddleware = require('../middlewares/auth.middleware');





authRouter.post('/register', authcontroller.registerUser);
authRouter.post('/login', authcontroller.loginUser);
authRouter.get('/logout', authcontroller.logoutUser);
authRouter.get('/get-me', authmiddleware, authcontroller.getmecontroller);



module.exports = authRouter;





const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const cors=require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const interviewRouter=require('./routes/interview.routes')
const {generateContent}=require('./services/ai.services');

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());

// generateContent();
app.use('/api', authRouter);
app.use('/api',interviewRouter);


module.exports = app;
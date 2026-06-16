const app=require('./src/app');
const dotenv=require('dotenv').config();
const connectDB=require('./src/config/database');
const PORT=process.env.PORT || 3000;


connectDB().then(() => {

   // generateInterviewReport({resume ,selfDescription,jobDescription})
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error starting the server:', error);
});



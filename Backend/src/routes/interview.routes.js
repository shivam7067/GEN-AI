 const express = require('express');
const interviewRouter = express.Router();
const authmiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware').upload;

interviewRouter.post('/generate-report', authmiddleware, upload.single('resume'), interviewController.generateReport);

interviewRouter.get('/interviews/:interviewId', authmiddleware, interviewController.getReportById);

module.exports = interviewRouter;
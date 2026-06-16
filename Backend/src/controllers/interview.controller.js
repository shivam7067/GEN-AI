const {generateInterviewReport}  = require('../services/ai.services');
const {InterviewReportModel} = require('../models/interviewReport.model');
const User = require('../models/user.model');
const pdfParse = require('pdf-parse');

const generateReport = async (req, res) => {
    try {
        console.log(req.body);
        const { selfDescription, jobDescription } = req.body;
        const resumeBuffer = req.file.buffer;
        const resumeText = await(new pdfParse.PDFParse(new Uint8Array(resumeBuffer))).getText();
      const interviewReportByAi = await generateInterviewReport({
    resume: resumeText.text,
    selfDescription,
    jobDescription
});

const parsedReport = JSON.parse(interviewReportByAi);

return res.status(200).json({
    success: true,
    report: parsedReport
});
    }
    catch(err){  console.error("Generate Report Error:", err);
    res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
        stack: err.stack
    }); res.status(500).json("internal server error")
    }
};

const getReportById = async (req, res) => {
    try{
        const { interviewId } = req.params;
        const interviewReport = await InterviewReportModel.findOne({ _id: interviewId, user: req.user.id });
        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found' });
        }
        console.log(interviewReport);
        res.status(200).json({ interviewReport });

    }
    catch(err){
        console.error("Get Report Error:", err);
        res.status(500).json("internal server error")
    }
};

module.exports = { generateReport, getReportById };
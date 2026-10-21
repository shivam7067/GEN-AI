const { generateInterviewReport } = require('../services/ai.services');
const { InterviewReportModel } = require('../models/interviewReport.model');
const pdfParse = require('pdf-parse');

const generateReport = async (req, res) => {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || jobDescription.trim() === '') {
            return res.status(400).json({ message: 'Job description is required.' });
        }

        let resumeText = '';

        if (req.file && req.file.buffer) {
            try {
                const { PDFParse } = pdfParse;
                const parser = new PDFParse({ data: req.file.buffer });
                const parsed = await parser.getText();
                resumeText = (parsed && parsed.text) ? parsed.text : '';
            } catch (pdfErr) {
                console.warn('PDF parsing warning:', pdfErr.message);
                resumeText = req.file.buffer.toString('utf-8');
            }
        } else if (req.body.resume) {
            resumeText = req.body.resume;
        }

        if (!resumeText && (!selfDescription || selfDescription.trim() === '')) {
            return res.status(400).json({ message: 'Please provide either a resume (PDF) or a self description.' });
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const parsedReport = JSON.parse(interviewReportByAi);

        // Normalize skill gaps and preparation plan for DB persistence
        const normalizedSkillGaps = Array.isArray(parsedReport.skillGaps)
            ? parsedReport.skillGaps.map(g => ({
                skill: typeof g === 'string' ? g : (g.skill || 'Skill gap'),
                severity: typeof g === 'object' && g.severity ? g.severity : 'Medium'
            }))
            : [];

        const normalizedPrepPlan = Array.isArray(parsedReport.preparationPlan)
            ? parsedReport.preparationPlan.map(p => ({
                day: Number(p.day) || 1,
                focus: p.focus || '',
                tasks: Array.isArray(p.tasks) ? p.tasks : (p.task ? [p.task] : [])
            }))
            : [];

        const userId = req.user?.userId || req.user?.id || req.user?._id;

        const savedReport = await InterviewReportModel.create({
            user: userId,
            resume: resumeText,
            selfDescription: selfDescription || '',
            jobDescription,
            candidateName: parsedReport.candidateName || 'Candidate',
            summary: parsedReport.summary || '',
            matchScore: typeof parsedReport.matchScore === 'number' ? parsedReport.matchScore : 0,
            technicalQuestions: parsedReport.technicalQuestions || [],
            behavioralQuestions: parsedReport.behavioralQuestions || [],
            skillGaps: normalizedSkillGaps,
            preparationPlan: normalizedPrepPlan
        });

        return res.status(200).json({
            success: true,
            interviewReport: savedReport,
            report: {
                ...parsedReport,
                _id: savedReport._id,
                id: savedReport._id
            }
        });
    } catch (err) {
        console.error('Generate Report Error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
};

const getReportById = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const userId = req.user?.userId || req.user?.id || req.user?._id;

        const interviewReport = await InterviewReportModel.findOne({
            _id: interviewId,
            user: userId
        });

        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found' });
        }

        return res.status(200).json({
            success: true,
            interviewReport,
            report: interviewReport
        });
    } catch (err) {
        console.error('Get Report Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { generateReport, getReportById };
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const interviewResponseSchema = {
    type: "OBJECT",
    properties: {
        candidateName: {
            type: "STRING",
            description: "The full name of the candidate extracted from the resume or self description. If unavailable, use 'Candidate'."
        },
        summary: {
            type: "STRING",
            description: "A comprehensive executive summary of the candidate's interview evaluation and readiness."
        },
        matchScore: {
            type: "NUMBER",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description."
        },
        technicalQuestions: {
            type: "ARRAY",
            description: "Technical questions that can be asked during the interview along with intention and ideal answer.",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The technical question" },
                    intention: { type: "STRING", description: "The intention behind asking this technical question" },
                    answer: { type: "STRING", description: "How to answer this question with key points" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            description: "Behavioral questions that can be asked during the interview along with intention and ideal answer.",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The behavioral question" },
                    intention: { type: "STRING", description: "The intention behind asking this behavioral question" },
                    answer: { type: "STRING", description: "How to answer this question with key points" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "ARRAY",
            description: "List of skill gaps identified between candidate profile and job description.",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING", description: "The skill identified as a gap" },
                    severity: { type: "STRING", description: "Severity level: Low, Medium, or High" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            description: "A day-wise preparation plan to address skill gaps.",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "NUMBER", description: "Day number in the plan" },
                    focus: { type: "STRING", description: "Focus area for the day" },
                    tasks: {
                        type: "ARRAY",
                        description: "List of actionable tasks for that day",
                        items: { type: "STRING" }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: [
        "candidateName",
        "summary",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
};

const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
    const prompt = `You are an expert technical interviewer and hiring consultant. Analyze the candidate's background against the job requirements and produce a detailed interview report.

Candidate Resume:
${resume || 'Not provided'}

Candidate Self-Description:
${selfDescription || 'Not provided'}

Target Job Description:
${jobDescription || 'Not provided'}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: interviewResponseSchema
        }
    });

    return response.text;
};

module.exports = { generateInterviewReport };

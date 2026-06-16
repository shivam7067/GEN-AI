const {GoogleGenAI} = require('@google/genai');
const {z}=require('zod');
const {zodToJsonSchema}=require('zod-to-json-schema');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})
console.log(process.env.GEMINI_API_KEY);

 async function generateContent(req,res){
const responce=await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'What is the capital of France?'

    })
console.log(responce.text);}

const interviewReportSchema=z.object({
    matchScore:z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions:z.array(z.object({
        question:z.string().describe("The technical question asked during the interview"),
        intention:z.string().describe("The intention of the interviewer behind asking the technical question"),
        answer:z.string().describe("how to answer this question ,what points to be covered in the answer"),
    })).describe("technical questions that can be asked during the interview along with the intention behind asking those questions and how to answer them"),

    behavioralQuestions:z.array(z.object({
        question:z.string().describe("The behavioral question asked during the interview"),
        intention:z.string().describe("The intention of the interviewer behind asking the behavioral question"),
        answer:z.string().describe("how to answer this question ,what points to be covered in the answer"),
    })).describe("behavioral questions that can be asked during the interview along with the intention behind asking those questions and how to answer them"),

    skillGaps:z.array(z.object({
        skill:z.string().describe("The skill gap identified during the interview"),
        saverity:z.string().describe("The severity of the skill gap"),
    })).describe("List of skill gaps identified during the interview"),

    preparationPlan:z.array(z.object({
        day:z.string().describe("The day number in the preparation plan"),
        focus:z.string().describe("The focus area for that day in the preparation plan"),
        tasks:z.array(z.string()).describe("The tasks to be completed on that day in the preparation plan"),
    })).describe("A day-wise preparation plan to address the identified skill gaps and improve performance in future interviews")
});

const generateInterviewReport=async({resume , selfDescription, jobDescription})=>{

    const prompt=`Generate an  interview report and ${interviewReportSchema.shape.matchScore.description  + interviewReportSchema.shape.technicalQuestions.description + interviewReportSchema.shape.behavioralQuestions.description + interviewReportSchema.shape.skillGaps.description + interviewReportSchema.shape.preparationPlan.description} for the candidate with the following information:

 Resume:${resume}
 Self-Description:${selfDescription}
Job Description:${jobDescription}`

const responce=await ai.models.generateContent({

    model: 'gemini-3-flash-preview',
    contents: prompt,
    config:{
        responseMimeType:'application/json',
        responseSchema:zodToJsonSchema(interviewReportSchema)
    }
    })
    
   
    return responce.text;

}
module.exports={generateInterviewReport,generateContent}


const mongoose = require('mongoose');



const technicalQuestionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required']
    },
    intention: {
        type: String,
        required: [true, 'Intention is required']
        },
        answer: {
            type: String,
            required: [true, 'Answer is required']
        }
   },
{
    _id: false
});


const behavioralQuestionsSchema = new mongoose.Schema({
     question: {
        type: String,
        required: [true, 'Question is required']
    },
    intention: {
        type: String,
        required: [true, 'Intention is required']
        },
        answer: {
            type: String,
            required: [true, 'Answer is required']
        }
   },
{
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Skill is required']
    },
    severity: {
       type: String,
       enum: ['Low', 'Medium', 'High'],
       required: [true, 'Severity is required']
    }

},
{
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required: [true, 'Day is required']
    },
    focus:{
        type: String,
        required: [true, 'Focus is required']
    },
    task:[{
        type: String,
        required: [true, 'Task is required']
        
    }]
})

const interviewReportSchema = new mongoose.Schema({

   

    jobDescription: {
        type: String,
        required: true
    },
    resume:{
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema]
})



mongoose.model('InterviewReport', interviewReportSchema);
mongoose.model('TechnicalQuestion', technicalQuestionsSchema);
mongoose.model('BehavioralQuestion', behavioralQuestionsSchema);
mongoose.model('SkillGap', skillGapSchema);
mongoose.model('PreparationPlan', preparationPlanSchema);

module.exports = {
    InterviewReportModel: mongoose.model('InterviewReport'),
    TechnicalQuestionModel: mongoose.model('TechnicalQuestion'),
    BehavioralQuestionModel: mongoose.model('BehavioralQuestion'),
    SkillGapModel: mongoose.model('SkillGap'),
    PreparationPlanModel: mongoose.model('PreparationPlan')
}


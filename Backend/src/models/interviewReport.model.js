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
}, {
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
}, {
    _id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Skill is required']
    },
    severity: {
        type: String,
        default: 'Medium'
    }
}, {
    _id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, 'Day is required']
    },
    focus: {
        type: String,
        required: [true, 'Focus is required']
    },
    tasks: [{
        type: String
    }],
    task: [{
        type: String
    }]
}, {
    _id: false
});

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        default: ''
    },
    selfDescription: {
        type: String,
        default: ''
    },
    candidateName: {
        type: String,
        default: 'Candidate'
    },
    summary: {
        type: String,
        default: ''
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema]
}, {
    timestamps: true
});

module.exports = {
    InterviewReportModel: mongoose.models.InterviewReport || mongoose.model('InterviewReport', interviewReportSchema),
    TechnicalQuestionModel: mongoose.models.TechnicalQuestion || mongoose.model('TechnicalQuestion', technicalQuestionsSchema),
    BehavioralQuestionModel: mongoose.models.BehavioralQuestion || mongoose.model('BehavioralQuestion', behavioralQuestionsSchema),
    SkillGapModel: mongoose.models.SkillGap || mongoose.model('SkillGap', skillGapSchema),
    PreparationPlanModel: mongoose.models.PreparationPlan || mongoose.model('PreparationPlan', preparationPlanSchema)
};

let mongoose = require('mongoose');

//Submission Schema
const SubmissionSchema = new mongoose.Schema({
    submission_id: String,
    student_id: { type: mongoose.Types.ObjectId, ref: 'Student' },
    problem_id: { type: mongoose.Types.ObjectId, ref: 'Problem' },
    language: String,
    solution: String,
    status: String,
    date: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = Submission;
const passport = require('passport');

//Model
const Staff = require('../models/Staff')
const Problem = require('../models/Problem')


exports.showIndex = (req, res) => {
    res.redirect('/staffs/dashboard')
}

exports.showSignin = (req, res) => {
    res.render('staffs/signin', { title: "Staff Signin" })
}

exports.signout = (req, res) => {
    req.logout()
    req.flash('success_msg', "You are successfully signed out")
    res.redirect('/staffs/signin')
}

exports.showDashboard = (req, res) => {
    res.render('staffs/dashboard', { title: "Staff Dashboard" })
}

exports.showProblems = async (req, res) => {
    let populatedStaff = await Staff.findById(req.user.id).populate("problems")
    res.render('staffs/problems', { title: "Problems", problems: populatedStaff.problems })
}

exports.showCreateProblem = (req, res) => {
    res.render('staffs/problemsCreate', { title: "Create Problem" })
}

exports.createProblem = async (req, res) => {
    try {
        //Create Problem
        const newProblem = new Problem({
            author: req.user.id,
            name: req.body.name,
            difficulty: req.body.difficulty,
            statement: req.body.statement,
            input_format: req.body.input_format,
            constraints: req.body.constraints,
            output_format: req.body.output_format,
            sample_testcases: req.body.sample_testcases,
            hidden_testcases: req.body.hidden_testcases,
            tags: req.body.tags
        });

        //Save Problem in DB
        const savedProblem = await newProblem.save()

        //Adding Problem ID to Staff 
        await Staff.findOneAndUpdate({ _id: req.user.id }, { $push: { problems: savedProblem.id } })

        req.flash('success_msg', "Problem Created")
        res.redirect('/staffs/problems/create')
    } catch (err) {
        console.log(err)
    }
}

exports.deleteProblem = async (req, res) => {
    let id = req.params.problem_id;
    try {
        await Problem.deleteOne({ _id: id })
        await Staff.findOneAndUpdate({ _id: req.user.id }, { $pull: { problems: id } })
        res.redirect("/staffs/problems")
    } catch (err) {
        console.log(err)
    }
}

exports.showEditProblem = async (req, res) => {
    try {
        const problem = await Problem.findOne({ _id: req.params.problem_id });
        res.render('staffs/problemsEdit', { title: "Edit Problem", problem: problem });
    } catch (err) {
        console.log(err);
    }
}

exports.editProblem = async (req, res) => {
    try {
        //Getting Problem from DB
        const problem = await Problem.findOne({ _id: req.params.problem_id });
        //Setting new values
        problem.name = req.body.name;
        problem.difficulty = req.body.difficulty;
        problem.statement = req.body.statement;
        problem.input_format = req.body.input_format;
        problem.constraints = req.body.constraints;
        problem.output_format = req.body.output_format;
        problem.sample_testcases = req.body.sample_testcases;
        problem.hidden_testcases = req.body.hidden_testcases;
        //Saving new values to DB
        await problem.save();

        req.flash('success_msg', "Problem Edited")
        res.redirect('/staffs/problems/' + req.params.problem_id + '/edit')

    } catch (err) {
        console.log(err);
    }
}


//Models
const Problem = require('../models/Problem')

exports.showIndex = (req, res) => {
    res.redirect('/students/dashboard')
};

exports.showSignin = (req, res) => {
    res.render('students/signin', { title: "Student Signin" });
};

exports.signout = (req, res) => {
    req.logout()
    req.flash('success_msg', "You are successfully signed out")
    res.redirect('/students/signin')
};

exports.showDashboard = (req, res) => {
    res.render('students/dashboard', { title: "Student Dashboard", reg_no: req.user.reg_no });
};

exports.redirectShowIde = async (req, res) => {
    try {
        let problem_id = await Problem.findOne({}).select('id')
        problem_id = problem_id['_id'];
        const reg_no = req.user.reg_no
        res.redirect(`/students/${reg_no}/ide/${problem_id}`)
    } catch (err) {
        console.log(err);
    }
}

exports.showIde = async (req, res) => {
    try {
        const problem_names = await Problem.find({}).select('name');
        const problem = await Problem.findById(req.params.problem_id);
        const reg_no = req.user.reg_no
        res.render('ide/index', { title: "Codeaholic IDE", problem_names: problem_names, reg_no: reg_no, problem: problem })
    } catch (err) {
        console.log(err);
    }
}


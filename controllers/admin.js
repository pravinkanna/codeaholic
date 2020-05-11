const { validationResult } = require('express-validator')

//Models
const Student = require('../models/Student');
const Staff = require('../models/Staff')
const Admin = require('../models/Admin')

exports.showIndex = (req, res) => {
    res.redirect('/admin/dashboard')
}

exports.showSignin = (req, res) => {
    res.render('admin/signin', { title: "Admin Signin" })
}


exports.signoutAdmin = (req, res) => {
    req.logout();
    req.flash('success_msg', "You are successfully signed out")
    res.redirect('/admin/signin')
}

exports.showDashboard = (req, res) => {
    res.render('admin/dashboard', { title: "Admin Dashboard" })

}

exports.showRegisterStudent = (req, res) => {
    res.render('admin/registerStudent', { title: "Register Student" })
}
exports.registerStudent = async (req, res) => {
    //Checking Student
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const { reg_no, name, phone_no, email } = req.body
        return res.render('admin/registerStudent', { title: "Register Student", reg_no: reg_no, name: name, email: email, phone_no: phone_no, errors: errors.array() });
    }
    //Adding new Student
    try {
        const newStudent = new Student({
            type: 'student',
            reg_no: req.body.reg_no,
            name: req.body.name,
            phone_no: req.body.phone_no,
            email: req.body.email,
            password: req.body.password
        });
        await newStudent.save()
        req.flash('success_msg', "Student is registered")
        res.redirect('/admin/registerStudent')
    } catch (err) {
        console.log(err)
    }
}


exports.showRegisterStaff = (req, res) => {
    res.render('admin/registerStaff', { title: "Register Staff" })
}
exports.registerStaff = async (req, res) => {
    //Checking Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const { reg_no, name, phone_no, email } = req.body
        return res.render('admin/registerStaff', { title: "Register Student", reg_no: reg_no, name: name, email: email, phone_no: phone_no, errors: errors.array() });
    }
    //Adding New Staff
    try {
        const newStaff = new Staff({
            type: 'staff',
            reg_no: req.body.reg_no,
            name: req.body.name,
            phone_no: req.body.phone_no,
            email: req.body.email,
            password: req.body.password
        });
        await newStaff.save()
        req.flash('success_msg', "Student is registered")
        res.redirect('/admin/registerStaff')
    } catch (err) {
        console.log(err)
    }
}

exports.showRegisterAdmin = (req, res) => {
    res.render('admin/registerAdmin', { title: "Register Admin" })

}
exports.registerAdmin = async (req, res) => {
    //Checking Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const { username, name, phone_no, email } = req.body
        return res.render('admin/registerAdmin', { title: "Register Admin", username: username, name: name, email: email, phone_no: phone_no, errors: errors.array() });
    }
    //Adding New Admin
    try {
        const newAdmin = new Admin({
            type: 'admin',
            username: req.body.username,
            name: req.body.name,
            phone_no: req.body.phone_no,
            email: req.body.email,
            password: req.body.password
        });
        await newAdmin.save()
        req.flash('success_msg', "Admin is registered")
        res.redirect('/admin/registerAdmin')
    } catch (err) {
        console.log(err)
    }
}





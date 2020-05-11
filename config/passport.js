const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')

//Load Model
const Student = require('../models/Student')
const Staff = require('../models/Staff')
const Admin = require('../models/Admin')

// req.flash('error_msg', "Please Login to continue")
module.exports = function (passport) {

    //Student Strategy 
    passport.use('student', new LocalStrategy({ usernameField: 'reg_no' }, async (reg_no, password, done) => {
        try {
            const student = await Student.findOne({ reg_no: reg_no });
            if (!student) {
                return done(null, false, { message: "Student not registered" })
            }
            if (password === student.password) {
                return done(null, student)
            }
            else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (err) {
            console.log(err);
        }
    }))

    //Staff Strategy
    passport.use('staff', new LocalStrategy({ usernameField: 'reg_no' }, async (reg_no, password, done) => {
        try {
            const staff = await Staff.findOne({ reg_no: reg_no });
            if (!staff) {
                return done(null, false, { message: "Staff not registered" })
            }
            if (password === staff.password) {
                return done(null, staff)
            }
            else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (err) {
            console.log(err);
        }
    }))

    //Admin Strategy
    passport.use('admin', new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
        try {
            const admin = await Admin.findOne({ username: username });
            if (!admin) {
                return done(null, false, { message: "Admin not registered" })
            }

            if (password === admin.password) {
                return done(null, admin)
            }
            else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (err) {
            console.log(err);
        }
    }))

    //Serialize & Deserialize
    passport.serializeUser(function (user, done) {
        done(null, { id: user.id, type: user.type });
    });

    passport.deserializeUser(function (user, done) {
        switch (user.type) {
            case 'student':
                Student.findById(user.id)
                    .then(student => {
                        if (student) {
                            done(null, student);
                        }
                        else {
                            done(new Error('Student id not found:' + user.id, null));
                        }
                    });
                break;
            case 'staff':
                Staff.findById(user.id)
                    .then(staff => {
                        if (staff) {
                            done(null, staff);
                        } else {
                            done(new Error('Staff id not found:' + user.id, null));
                        }
                    });
                break;
            case 'admin':
                Admin.findById(user.id)
                    .then(admin => {
                        if (admin) {
                            done(null, admin);
                        } else {
                            done(new Error('Admin id not found:' + user.id, null));
                        }
                    });
                break;
            default:
                done(new Error('no entity type:', user.type), null);
                break;
        }
    });
}

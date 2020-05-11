const { check, body } = require('express-validator');

//Models
const Student = require('../models/Student');
const Staff = require('../models/Staff')
const Admin = require('../models/Admin')

exports.registerStudent = [
    //Check Reg no is numeric
    check('reg_no').trim().isNumeric().withMessage('Register number must be numeric'),
    //Check name is alphabets
    check('name').trim().isLength({ min: 3 }).withMessage('Name is not valid'),
    //Checking Phone number
    check('phone_no').trim().isNumeric().withMessage("Phone number is not valid").isLength({ min: 10, max: 10 }).withMessage("Phone number is not valid"),
    // username must be an email
    check('email').trim().isEmail().withMessage('Email is not valid'),
    // password must be at least 6 chars long
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars long'),
    //checking both password match
    body('password').custom((value, { req }) => {
        if (value !== req.body.re_password) {
            throw new Error('Password does not match ');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    //Checking Student Already Exist
    body('reg_no').custom(reg_no => {
        return Student.findOne({ reg_no: reg_no })
            .then(Student => {
                if (Student) return Promise.reject('Student already registered');
            });
    })
]

exports.registerStaff = [
    check('reg_no').trim().isNumeric().withMessage('Register number is not valid'),
    //Check name is alphabets
    check('name').trim().isLength({ min: 3 }).withMessage('Name is not valid'),
    //Checking Phone number
    check('phone_no').trim().isNumeric().withMessage("Phone number is not valid").isLength({ min: 10, max: 10 }).withMessage("Phone number is not valid"),
    // username must be an email
    check('email').trim().isEmail().withMessage('Email is not valid'),
    // password must be at least 6 chars long
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars long'),
    //checking both password match
    body('password').custom((value, { req }) => {
        if (value !== req.body.re_password) {
            throw new Error('Password does not match ');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    //Checking Staff Already Exist
    body('reg_no').custom(reg_no => {
        return Staff.findOne({ reg_no: reg_no })
            .then(Staff => {
                if (Staff) return Promise.reject('Staff already registered');
            });
    })
];

exports.registerAdmin = [
    check('username').trim().isAlpha().withMessage('Username is not valid'),
    //Check name is alphabets
    check('name').trim().isLength({ min: 3 }).withMessage('Name is not valid'),
    //Checking Phone number
    check('phone_no').trim().isNumeric().withMessage("Phone number is not valid").isLength({ min: 10, max: 10 }).withMessage("Phone number is not valid"),
    // username must be an email
    check('email').trim().isEmail().withMessage('Email is not valid'),
    // password must be at least 6 chars long
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars long'),
    //checking both password match
    body('password').custom((value, { req }) => {
        if (value !== req.body.re_password) {
            throw new Error('Password does not match ');
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    //Checking Admin Already Exist
    body('username').custom(username => {
        return Admin.findOne({ username: username })
            .then(Admin => {
                if (Admin) return Promise.reject('Admin already registered');
            });
    })
];

exports.createProblem = [

]
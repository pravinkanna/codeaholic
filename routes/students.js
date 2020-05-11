const express = require('express');
const router = express.Router();
const passport = require('passport');


//Middleware
const { ensureAuthenticatedStudent } = require('../middlewares/authenticator');

//Controller
const studentController = require('../controllers/students')
const ideController = require('../controllers/ide')

/* GET users listing. */
router.get('/', ensureAuthenticatedStudent, studentController.showIndex);

router.get('/signin', studentController.showSignin);

router.post('/signin', passport.authenticate('student', { successRedirect: '/students/dashboard', failureRedirect: '/students/signin', failureFlash: true }));

router.get('/signout', ensureAuthenticatedStudent, studentController.signout);

router.get('/dashboard', ensureAuthenticatedStudent, studentController.showDashboard);

router.get('/:reg_no/ide', ensureAuthenticatedStudent, studentController.redirectShowIde);

router.get('/:reg_no/ide/:problem_id', ensureAuthenticatedStudent, studentController.showIde);

router.post('/:reg_no/ide/:problem_id/run', ensureAuthenticatedStudent, ideController.run);

router.post('/:reg_no/ide/:problem_id/submit', ensureAuthenticatedStudent, ideController.submit);

module.exports = router;

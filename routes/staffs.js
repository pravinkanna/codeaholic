const express = require('express');
const router = express.Router();
const passport = require('passport');

//Middleware
const { ensureAuthenticatedStaff } = require('../middlewares/authenticator');

//Controller
const staffController = require('../controllers/staffs')


//Routes
router.get('/', ensureAuthenticatedStaff, staffController.showIndex);

router.get('/signin', staffController.showSignin);

router.post('/signin', passport.authenticate('staff', { successRedirect: '/staffs/dashboard', failureRedirect: '/staffs/signin', failureFlash: true }));

router.get('/signout', ensureAuthenticatedStaff, staffController.signout);

router.get('/dashboard', ensureAuthenticatedStaff, staffController.showDashboard);

router.get('/problems', ensureAuthenticatedStaff, staffController.showProblems);

router.get('/problems/create', ensureAuthenticatedStaff, staffController.showCreateProblem);

router.post('/problems/create', ensureAuthenticatedStaff, staffController.createProblem);

router.get('/problems/:problem_id/edit', ensureAuthenticatedStaff, staffController.showEditProblem);

router.post('/problems/:problem_id/edit', ensureAuthenticatedStaff, staffController.editProblem);

router.get('/problems/:problem_id/delete', ensureAuthenticatedStaff, staffController.deleteProblem);


//Exports
module.exports = router;

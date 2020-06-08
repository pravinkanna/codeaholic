const express = require('express');
const router = express.Router();
const passport = require('passport')

const { ensureAuthenticatedAdmin } = require('../middlewares/authenticator');

//Validator Middleware
const validator = require('../middlewares/validator')

//Controller
const adminController = require('../controllers/admin')


/* GET users listing. */
router.get('/', ensureAuthenticatedAdmin, adminController.showIndex);

router.get('/signin', adminController.showSignin);

router.post('/signin', passport.authenticate('admin', { successRedirect: '/admin/dashboard', failureRedirect: '/admin/signin', failureFlash: true }));

router.get('/signout', adminController.signoutAdmin);

router.get('/dashboard', ensureAuthenticatedAdmin, adminController.showDashboard);

router.get('/registerStudent', ensureAuthenticatedAdmin, adminController.showRegisterStudent);

router.post('/registerStudent', validator.registerStudent, adminController.registerStudent);

router.get('/registerStaff', ensureAuthenticatedAdmin, adminController.showRegisterStaff);

router.post('/registerStaff', validator.registerStaff, adminController.registerStaff);

router.get('/registerAdmin', ensureAuthenticatedAdmin, adminController.showRegisterAdmin);

router.post('/registerAdmin', validator.registerAdmin, adminController.registerAdmin);

module.exports = router;

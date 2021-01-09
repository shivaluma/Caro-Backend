const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const AdminAuthController = require('../controllers/admin/auth.controller');

router.post('/signin', AuthController.postSignIn);
router.post('/signup', AuthController.postSignUp);
router.post('/signin-google', AuthController.postGoogleSignIn);
router.post('/signin-facebook', AuthController.postFacebookSignin);
router.get('/check-field', AuthController.getValidField);
router.get('/check-token', AuthController.getCheckToken);
router.post('/change-password', AuthController.changeNewPassword);
router.post('/forgot-password', AuthController.postForgotPassword);
// admin route
router.post('/admin/signin', AdminAuthController.postSignInAdmin);
module.exports = router;

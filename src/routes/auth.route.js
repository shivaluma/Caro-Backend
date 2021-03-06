const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');

router.post('/signin', AuthController.postSignIn);
router.post('/signup', AuthController.postSignUp);
router.post('/signin-google', AuthController.postGoogleSignIn);
router.post('/signin-facebook', AuthController.postFacebookSignin);
router.get('/check-field', AuthController.getValidField);
router.get('/check-token', AuthController.getCheckToken);
router.post('/change-password', AuthController.changeNewPassword);
router.post('/forgot-password', AuthController.postForgotPassword);
router.post('/resend-email', AuthController.postResendEmail);

module.exports = router;

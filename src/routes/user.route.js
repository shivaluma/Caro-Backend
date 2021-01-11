const router = require('express').Router();
const passport = require('passport');
const UserController = require('../controllers/user.controller');
const AdminMiddleWare = require('../middleware/admin-auth.middleware');
const AdminController = require('../controllers/admin/auth.controller');

const authenticate = passport.authenticate('jwt', { session: false });

router.get('/me', authenticate, UserController.getMe);
router.get('/online', UserController.getOnline);
router.get('/profile-full', UserController.getFullProfile);
router.get('/leaderboard', UserController.getLeaderboard);
router.put('/', authenticate, UserController.putUpdateProfile);
router.put('/password', authenticate, UserController.changePassword);
router.put('/active-account', UserController.activeAccount);

// admin route
router.get('/admin', AdminMiddleWare, AdminController.getAllUsers);
router.get('/admin/search', AdminMiddleWare, AdminController.searchUser);
router.get('/admin/:userId', AdminMiddleWare, AdminController.getUserById);
router.post('/admin/:userId', AdminMiddleWare, AdminController.updateUserById);

module.exports = router;

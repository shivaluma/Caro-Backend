const router = require('express').Router();
const passport = require('passport');
const UserController = require('../controllers/user.controller');

const authenticate = passport.authenticate('jwt', { session: false });

router.get('/me', authenticate, UserController.getMe);
router.get('/online', UserController.getOnline);
router.get('/profile', UserController.getProfile);
router.get('/profile-game', UserController.getGameProfile);
router.get('/leaderboard', UserController.getLeaderboard);
router.put('/', authenticate, UserController.putUpdateProfile);
router.put('/password', authenticate, UserController.changePassword);
router.put('/active-account', UserController.activeAccount);

// admin route

module.exports = router;

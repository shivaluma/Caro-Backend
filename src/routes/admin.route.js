const router = require('express').Router();
const passport = require('passport');
const AdminAuthController = require('../controllers/admin/auth.controller');
const AdminController = require('../controllers/admin/admin.controller');
const AdminMiddleWare = require('../middleware/admin-auth.middleware');

const authenticate = passport.authenticate('jwt', { session: false });

router.post('/signin', AdminAuthController.postSignInAdmin);
router.get('/me', authenticate, AdminMiddleWare, AdminController.getMe);
router.get(
  '/matchs',
  authenticate,
  AdminMiddleWare,
  AdminController.getAllMatch,
);
router.get(
  '/match/user/:userId',
  authenticate,
  AdminMiddleWare,
  AdminController.getMatchByUserId,
);

router.get(
  '/match/:matchId',
  authenticate,
  AdminMiddleWare,
  AdminController.getMatchByMatchId,
);

router.get(
  '/chat/:matchId',
  authenticate,
  AdminMiddleWare,
  AdminController.getChatByMatchId,
);

router.get(
  '/users',
  authenticate,
  AdminMiddleWare,
  AdminController.getAllUsers,
);

router.get(
  '/user/:userId',
  authenticate,
  AdminMiddleWare,
  AdminController.getUserById,
);

router.post(
  '/user/:userId',
  authenticate,
  AdminMiddleWare,
  AdminController.updateUserById,
);

module.exports = router;

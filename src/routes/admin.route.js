const router = require('express').Router();
const AdminAuthController = require('../controllers/admin/auth.controller');
const AdminController = require('../controllers/admin/admin.controller');
const AdminMiddleWare = require('../middleware/admin-auth.middleware');

router.post('/signin', AdminAuthController.postSignInAdmin);
router.get('/matchs', AdminMiddleWare, AdminController.getAllHistory);
router.get(
  '/match/:userId',
  AdminMiddleWare,
  AdminController.getHistoryByUserId,
);
router.get('/chat/:matchId', AdminMiddleWare, AdminController.getChatByMatchId);

router.get('/users', AdminMiddleWare, AdminController.getAllUsers);
router.get('/users/search', AdminMiddleWare, AdminController.searchUser);
router.get('/user/:userId', AdminMiddleWare, AdminController.getUserById);
router.post('/user/:userId', AdminMiddleWare, AdminController.updateUserById);

module.exports = router;

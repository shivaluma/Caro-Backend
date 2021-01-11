const router = require('express').Router();
const AdminMiddleWare = require('../middleware/admin-auth.middleware');
const RoomController = require('../controllers/room.controller');
const AdminController = require('../controllers/admin/admin.controller');

router.get('/', RoomController.getRooms);
router.get('/:id', RoomController.getRoomById);
router.post('/check-password', RoomController.checkPassword);

// admin route

router.get('/admin/history', AdminMiddleWare, AdminController.getAllHistory);
router.get(
  '/admin/:userId',
  AdminMiddleWare,
  AdminController.getHistoryByUserId,
);
router.get(
  '/chat/admin/:matchId',
  AdminMiddleWare,
  AdminController.getChatByMatchId,
);
module.exports = router;

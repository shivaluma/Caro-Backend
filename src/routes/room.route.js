const router = require('express').Router();

const RoomController = require('../controllers/room.controller');

router.get('/', RoomController.getRooms);
router.get('/:id', RoomController.getRoomById);
// router.put('/', authenticate, UserController.getMe);
module.exports = router;

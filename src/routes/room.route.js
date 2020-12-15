const router = require('express').Router();

const RoomController = require('../controllers/room.controller');

router.get('/', RoomController.getRooms);

// router.put('/', authenticate, UserController.getMe);
module.exports = router;

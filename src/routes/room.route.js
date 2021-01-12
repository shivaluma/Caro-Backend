const router = require('express').Router();
const RoomController = require('../controllers/room.controller');

router.get('/', RoomController.getRooms);
router.get('/:id', RoomController.getRoomById);
router.post('/check-password', RoomController.checkPassword);

// admin route

module.exports = router;

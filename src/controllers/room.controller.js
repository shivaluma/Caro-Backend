const RoomService = require('../services/RoomService');
const ResponseService = require('../services/ResponseService');

exports.getRooms = (req, res) => {
  const rooms = RoomService.rooms.filter((r) => r !== null);
  return res
    .status(200)
    .json(ResponseService.response(200, 'Get all room success', rooms));
};

const RoomService = require('../services/RoomService');
const ResponseService = require('../services/ResponseService');

exports.getRooms = (req, res) => {
  const rooms = RoomService.rooms.filter((r) => r !== null);
  return res
    .status(200)
    .json(ResponseService.response(200, 'Get all room success', rooms));
};

exports.getRoomById = (req, res) => {
  const { type } = req.query;
  const { id } = req.params;
  const room = type === 'public' ? RoomService.rooms[Number(id)] : null;

  return res
    .status(200)
    .json(ResponseService.response(200, 'Get room success', room));
};

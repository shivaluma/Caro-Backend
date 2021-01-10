const argon = require('argon2');
const RoomService = require('../services/RoomService');
const ResponseService = require('../services/ResponseService');

exports.checkPassword = async (req, res) => {
  const { roomId, password } = req.body;
  const room = RoomService.rooms[Number(roomId)];
  if (!room)
    return res.status(400).json(ResponseService.response(400, 'NO ROOM', true));
  const isPasswordMatch = await argon.verify(room.password, password);

  if (isPasswordMatch)
    return res.status(200).json(ResponseService.response(200, 'OK', true));

  return res.status(400).json(ResponseService.response(400, 'NOT OK', true));
};

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

const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

const rooms = new Array(20).fill(3).map((val, index) => ({
  firstPlayer: null,
  secondPlayer: null,
  roomId: index,
  chats: [],
  createdAt: new Date(),
}));

module.exports = {
  rooms,
  getRoomByRoomId: async (id) => {
    return rooms[id];
  },
  getRoomByPublicId: async (id) => {
    const room = await getCollection('rooms').findById(ObjectId(id));
    return room;
  },
  createRoom: async (room, winner, board) => {
    console.log(room);
    return await getCollection('rooms').insertOne({
      firstPlayer: room.firstPlayer,
      secondPlayer: room.secondPlayer,
      chats: room.chats,
      winner: winner,
      board: board,
    });
  },
};

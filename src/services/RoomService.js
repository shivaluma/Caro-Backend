const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

const rooms = new Array(20).fill(null);

module.exports = {
  rooms,
  getRoomByRoomId: async (id) => {
    return rooms[id];
  },
  getRoomByPublicId: async (id) => {
    const room = await getCollection('rooms').findById(ObjectId(id));
    return room;
  },
  createRoom: async ({ firstPlayer, secondPlayer }) => {
    const room = await getCollection('rooms').insertOne({
      firstPlayer,
      secondPlayer,
      chats: [],
      rule: {},
    });
    return room;
  },
};

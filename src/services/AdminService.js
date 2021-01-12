const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  getAllUsers: async () => {
    const users = await getCollection('users').find(
      {
        role: 'user',
      },
      { projection: { password: 0 } },
    );
    return users.toArray();
  },

  getUserById: async (id) => {
    const user = await getCollection('users').findOne(
      {
        _id: ObjectId(id),
      },
      { projection: { password: 0 } },
    );
    return user;
  },

  getAllHistory: async () => {
    const histories = await getCollection('rooms').find({});
    return histories.toArray();
  },

  updateUserById: async (id, status) => {
    const updated = await getCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { status } },
      { returnNewDocument: true, returnOriginal: false },
    );
    return updated;
  },

  getHistoryByUserId: async (id) => {
    const games = await getCollection('rooms')
      .find(
        {
          $or: [{ 'firstPlayer._id': id }, { 'secondPlayer._id': id }],
        },
        { projection: { chats: 0, board: 0 } },
      )
      .toArray();
    return games;
  },

  getChatByMatchId: async (matchId) => {
    const history = await getCollection('rooms').findOne({
      _id: ObjectId(matchId),
    });
    return history;
  },
};

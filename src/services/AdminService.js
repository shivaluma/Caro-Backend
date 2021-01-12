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
    const history = await getCollection('rooms').findOne({ _id: ObjectId(id) });
    return history;
  },

  getChatByMatchId: async (matchId) => {
    const history = await getCollection('rooms').findOne({
      _id: ObjectId(matchId),
    });
    return history;
  },
};

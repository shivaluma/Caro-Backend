const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  createUser: async (email, password, displayName, idGoogle, idFacebook) => {
    try {
      const user = await getCollection('users').insertOne({
        email,
        password,
        role: 'user',
        status: 'active',
        displayName,
        idGoogle,
        active: false,
        idFacebook,
        point: 1000,
        wincount: 0,
        losecount: 0,
        drawcount: 0,
      });
      return user.ops[0];
    } catch (err) {
      throw new Error(err);
    }
  },
  findOne: async (filter, projection) => {
    try {
      const user = await getCollection('users').findOne(filter, projection);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  },

  updateField: async (id, update) => {
    const user = await getCollection('users').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { ...update } },
      {
        returnNewDocument: true,
        returnOriginal: false,
        projection: { password: 0 },
      },
    );
    return user.value;
  },

  updateFieldByCustomQuery: async (query, update) => {
    const user = await getCollection('users').findOneAndUpdate(
      query,
      { $set: { ...update } },
      {
        returnNewDocument: true,
        returnOriginal: false,
        projection: { password: 0 },
      },
    );
    return user.value;
  },

  getUserInfo: async (id) => {
    const user = await getCollection('users').findOne(
      {
        _id: ObjectId(id),
      },
      { projection: { password: 0 } },
    );
    return user;
  },

  getUserGames: async (id) => {
    const games = getCollection('rooms')
      .find(
        {
          $or: [{ 'firstPlayer._id': id }, { 'secondPlayer._id': id }],
        },
        { projection: { chats: 0, board: 0 } },
      )
      .sort({ createAt: -1 })
      .limit(10)
      .toArray();
    return games;
  },

  getLeaderboard: async () => {
    const users = await getCollection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ point: -1 })
      .toArray();
    return users;
  },
};

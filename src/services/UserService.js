const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  createUser: async (email, password, displayName, idGoogle, idFacebook) => {
    try {
      const user = await getCollection('users').insertOne({
        email,
        password,
        role: 'user',
        displayName,

        idGoogle,
        idFacebook,
        point: 1000,
        wincount: 0,
        losecount: 0,
        drawcount: 0,
      });
      return user;
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
      { $set: { displayName: update.displayName } },
      {
        returnNewDocument: true,
        returnOriginal: false,
        projection: { password: 0 },
      },
    );
    return user.value;
  },

  getUserWithGame: async (id) => {
    const userPromise = getCollection('users').findOne(
      {
        _id: ObjectId(id),
      },
      { projection: { password: 0 } },
    );
    const gamesPromise = getCollection('rooms')
      .find(
        {
          $or: [{ 'firstPlayer._id': id }, { 'secondPlayer._id': id }],
        },
        { projection: { chats: 0, board: 0 } },
      )
      .toArray();

    const [user, games] = await Promise.allSettled([userPromise, gamesPromise]);

    return { user, games };
  },
};

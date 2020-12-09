const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  createUser: async (email, password, displayName, idGoogle, idFacebook) => {
    try {
      const user = await getCollection('users').insertOne({
        email,
        password,
        displayName,
        idGoogle,
        idFacebook,
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
      }
    );

    return user.value;
  },
};

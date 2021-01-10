const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  addUser: async (user) => {
    const newData = { ...user };
    newData.idUser = ObjectId(user._id);
    delete newData._od;
    try {
      await getCollection('onlines').update(
        { idUser: ObjectId(user._id) },
        newData,
        { upsert: true },
      );
    } catch (err) {
      throw new Error(err);
    }
  },

  removeUser: async (user) => {
    try {
      await getCollection('onlines').deleteOne({
        idUser: ObjectId(user._id),
      });
    } catch (err) {
      throw new Error(err);
    }
  },
  getUsersOnline: async () => {
    try {
      const onlines = await getCollection('onlines').find({});
      return onlines.toArray();
    } catch (err) {
      throw new Error(err);
    }
  },
};

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
    const history = await getCollection('rooms').find({});
    return history.toArray();
  },
  updateUserById: async (id, user) => {
    const updated = await getCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: { user } },
    );
    return updated;
  },
};

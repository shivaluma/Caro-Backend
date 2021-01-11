const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  getAllUsers: async () => {
    const users = await getCollection('users').find({
      role: 'user',
    });
    return users.toArray();
  },
  getUserById: async (id) => {
    const user = await getCollection('users').findOne({
      _id: id,
    });
    return user;
  },
};

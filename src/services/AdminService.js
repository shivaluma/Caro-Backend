const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  getAllUsers: async () => {
    try {
      const user = await getCollection('users').find({
        role: 'user',
      });
      return user.toArray();
    } catch (err) {
      throw new Error(err);
    }
  },
};

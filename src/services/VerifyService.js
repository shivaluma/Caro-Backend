const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  createVerify: async (token, uid, email) => {
    try {
      const verify = await getCollection('verifies').insertOne({
        token,
        uid,
        email,
        createAt: Date.now(),
      });
      return verify;
    } catch (err) {
      throw new Error(err);
    }
  },
  findOne: async (filter, projection) => {
    try {
      const verify = await getCollection('verifies').findOne(
        filter,
        projection,
      );
      return verify;
    } catch (err) {
      throw new Error(err);
    }
  },

  deleteOne: async (filter) => {
    try {
      await getCollection('verifies').deleteOne(filter);
    } catch (err) {
      throw new Error(err);
    }
  },
};

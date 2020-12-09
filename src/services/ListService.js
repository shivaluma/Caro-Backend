const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  getList: async (idList) => {
    const list = await getCollection('lists').findOne({
      _id: ObjectId(idList),
    });
    return list;
  },

  getListByBoard: async (idBoard) => {
    const list = await getCollection('lists').find({
      idboard: ObjectId(idBoard),
    });
    return list;
  },

  createList: async (idBoard, name) => {
    const list = await getCollection('lists').insertOne({
      name,
      idBoard,
      createdAt: new Date(),
    });
    return list.ops[0];
  },
};

const { nanoid } = require('nanoid');

const { ObjectId } = require('mongodb');
const getCollection = require('../utils/getCollection');

module.exports = {
  getBoards: async (uid) => {
    const boards = await getCollection('boards')
      .find({
        userId: ObjectId(uid),
      })
      .toArray();

    return boards;
  },

  getBoard: async (idBoard) => {
    const board = await getCollection('boards')
      .aggregate([
        { $match: { _id: ObjectId(idBoard) } },
        {
          $lookup: {
            from: 'lists',
            let: {
              idBoard: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$idBoard', '$$idBoard'],
                  },
                },
              },
              {
                $lookup: {
                  from: 'cards',
                  let: {
                    idList: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$idList', '$$idList'],
                        },
                      },
                    },
                    {
                      $sort: {
                        pos: -1,
                      },
                    },
                  ],
                  as: 'cards',
                },
              },
            ],
            as: 'lists',
          },
        },
      ])
      .toArray();
    return board;
  },
  createBoard: async (uid, name, description) => {
    const board = await getCollection('boards').insertOne({
      userId: uid,
      name,
      shortId: nanoid(12),
      description,
      createdAt: new Date(),
    });
    return board.ops[0];
  },

  removeBoard: async (uid, id) => {
    await getCollection('boards').deleteOne({
      userId: ObjectId(uid),
      _id: ObjectId(id),
    });

    await getCollection('lists').deleteMany({
      idBoard: ObjectId(id),
    });
  },

  updateBoard: async (uid, bid, data) => {
    try {
      const board = await getCollection('boards').findOneAndUpdate(
        {
          _id: ObjectId(bid),
          userId: ObjectId(uid),
        },
        {
          $set: { name: data.name, description: data.description },
        }
      );
      return board;
    } catch (err) {
      throw new Error(err);
    }
  },
};

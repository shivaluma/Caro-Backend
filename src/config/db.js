require('dotenv').config();
const mongodb = require('mongodb');

const { MongoClient } = mongodb;

let db;
// eslint-disable-next-line
const initDb = (callback) => {
  if (db) {
    return callback(null, db);
  }
  MongoClient.connect(process.env.MONGODB_URL, { useUnifiedTopology: true })
    .then((client) => {
      db = client;
      callback(null, db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!db) {
    throw Error('Database not initialzed');
  }
  return db;
};

module.exports = {
  initDb,
  getDb,
};

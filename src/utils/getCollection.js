const db = require('../config/db');

module.exports = (name) => db.getDb().db().collection(name);

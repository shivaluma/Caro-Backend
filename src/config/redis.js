const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis);

const client = redis.createClient({
  host: process.env.REDIS_HOST || '10.126.4.69',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASS || 'pppp',
});

module.exports = client;

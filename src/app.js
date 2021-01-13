require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const pino = require('pino');
const expressPino = require('express-pino-logger');
const bodyParser = require('body-parser');
const passport = require('passport');
const socketio = require('socket.io');
const adapter = require('socket.io-redis');
const http = require('http');
const db = require('./config/db');

const redisAdapter = adapter({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: 'pppp',
});

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: { colorize: true },
});
const expressLogger = expressPino({ logger });
const router = require('./routes');

const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer, {
  cors: {
    origin: '*',
  },

  transports: ['websocket'],
});
io.adapter(redisAdapter);
require('./socket/configureSocket').setupSocket(io);

app.use(bodyParser.json());
app.use(cors());
app.use(compression());
app.use(expressLogger);

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/v1', router);
app.use('*', (req, res) =>
  res.status(404).json({ message: 'Not found', path: req.originalUrl }),
);
db.initDb((err) => {
  if (err) {
    logger.error(err);
  } else {
    httpServer.listen(process.env.PORT, async () => {
      logger.info(`Server started on port ${process.env.PORT}`);
    });
  }
});

module.exports = {
  logger,
};

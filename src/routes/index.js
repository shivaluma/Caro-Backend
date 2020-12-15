const router = require('express').Router();
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const roomRouter = require('./room.route');
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/rooms', roomRouter);
module.exports = router;

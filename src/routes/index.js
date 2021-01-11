const router = require('express').Router();
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const roomRouter = require('./room.route');
const adminRouter = require('./admin.route')
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/rooms', roomRouter);
router.use('/admin', adminRouter);
module.exports = router;

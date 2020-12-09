const router = require('express').Router();
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const boardRouter = require('./board.route');
const listRouter = require('./list.route');
const cardRouter = require('./card.route');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/boards', boardRouter);
router.use('/lists', listRouter);
router.use('/cards', cardRouter);
module.exports = router;

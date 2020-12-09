const router = require('express').Router();
const passport = require('passport');
const BoardController = require('../controllers/board.controller');

const authenticate = passport.authenticate('jwt', { session: false });

router.get('/', authenticate, BoardController.getBoards);
router.get('/:idBoard', authenticate, BoardController.getBoard);
router.post('/', authenticate, BoardController.postBoard);
router.put('/:id', authenticate, BoardController.putBoard);
router.delete('/:id', authenticate, BoardController.deleteBoard);

// router.get('/:boardId/lists/', authenticate, BoardController.getLists);

// router.get('/:boardId/lists/:listId', authenticate, BoardController.getList);

// router.post('/:boardId/lists/', authenticate, BoardController.createList);

module.exports = router;

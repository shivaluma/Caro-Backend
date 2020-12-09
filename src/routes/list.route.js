const router = require('express').Router();
const passport = require('passport');
const ListController = require('../controllers/list.controller');

const authenticate = passport.authenticate('jwt', { session: false });

router.get('/', authenticate, ListController.getLists);

router.get('/:id', authenticate, ListController.getList);
router.post('/', authenticate, ListController.postList);
// router.put('/:id', authenticate, );
// router.delete('/:id', authenticate, ListController);

// router.get('/:boardId/lists/', authenticate, BoardController.getLists);

// router.get('/:boardId/lists/:listId', authenticate, BoardController.getList);

// router.post('/:boardId/lists/', authenticate, BoardController.createList);

module.exports = router;

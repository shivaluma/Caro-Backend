const router = require('express').Router();
const passport = require('passport');
const CardController = require('../controllers/card.controller');

const authenticate = passport.authenticate('jwt', { session: false });

router.get('/:id', authenticate, CardController.getCard);
router.post('/', authenticate, CardController.postCard);
router.put('/:id', authenticate, CardController.putCard);
router.delete('/:id', authenticate, CardController.deleteCard);

module.exports = router;

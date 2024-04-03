const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.listCartItems);
router.delete('/:userId/:productId', cartController.removeFromCart);

module.exports = router;

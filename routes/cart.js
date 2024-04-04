
const express = require('express');
const router = express.Router();
const Cart = require('../src/UserCart');

router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware
    const cartItem = await Cart.create({ user: userId, productId, quantity });
    res.json({ success: true, message: 'Product added to cart successfully', cartItem });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add product to cart' });
  }
});

module.exports = router;

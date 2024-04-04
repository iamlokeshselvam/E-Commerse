

const UserCart = require('../src/UserCart');

// Add product to cart
exports.addToCart = async (req, res) => {
  const { userId, productId} = req.body;

  try {
    const existingItem = await UserCart.findOne({ userId });
console.log(existingItem);
    // if (existingItem) {
    //   await existingItem.save();

    // } else {
     
    //   await UserCart.create({ userId, productId});
    // }

    res.status(200).json({ success: true, message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add product to cart' });
  }
};

// List cart items for a user
exports.listCartItems = async (req, res) => {
  const userId = req.params.userId; 

  try {
    const cartItems = await UserCart.find({ userId }).populate('productId');

    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    console.error('Error listing cart items:', error);
    res.status(500).json({ success: false, message: 'Failed to list cart items' });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    await UserCart.findOneAndDelete({ userId, productId });
    res.status(200).json({ success: true, message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ success: false, message: 'Failed to remove product from cart' });
  }
};

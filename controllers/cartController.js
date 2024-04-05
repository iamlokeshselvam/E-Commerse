

const UserCart = require('../src/UserCart');
// const user = require('../src/User');

// Add product to cart
exports.addToCart = async (req, res) => {
  const {userName,productId} = req.body;
  // const userName =req.user.userName;

  try {
    const existingItem = await UserCart.findOne({ userName });
// console.log(existingItem);
    if (existingItem) {
      await existingItem.save();

    } else {
     
      await UserCart.create({ userName, productId});
    }

    res.status(200).json({ success: true, message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add product to cart' });
  }
};

// List cart items for a user
exports.listCartItemsWithDetails = async (req, res) => {
  const userName = req.params.userName;

  try {
    // Retrieve the list of product IDs from the user's cart
    const cartItems = await UserCart.find({ userName });

    // Initialize an array to store product details
    const cartItemsWithDetails = [];

    // Iterate through each product ID in the cart
    for (const cartItem of cartItems) {
      // Send a GET request to fetch details for the product using the external API
      const response = await axios.get(`https://fakestoreapi.com/products/${cartItem.productId}`);
      const productDetails = response.data;

      // Add the product details to the array
      cartItemsWithDetails.push(productDetails);
    }

    // Send the response containing product details for items in the cart
    res.status(200).json({ success: true, cartItems: cartItemsWithDetails });
  } catch (error) {
    console.error('Error listing cart items with details:', error);
    res.status(500).json({ success: false, message: 'Failed to list cart items with details' });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  const { userName, productId } = req.params;

  try {
    await UserCart.findOneAndDelete({ userName, productId });
    res.status(200).json({ success: true, message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ success: false, message: 'Failed to remove product from cart' });
  }
};

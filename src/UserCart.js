
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: String},
  productId: { type: String},
});

module.exports = mongoose.model('Cart', cartSchema);

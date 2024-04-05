
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userName: { type: String},
  productId: { type: String},
});

module.exports = mongoose.model('Cart', cartSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  image: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

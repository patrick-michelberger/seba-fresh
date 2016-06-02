'use strict';

var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  categoryPath: String,
  description: String,
  brand: String,
  thumbnailImage: String,
  mediumImage: String,
  largeImage: String,
  productUrl: String,
  stock: String,
  addToCartUrl: String
}, {
  collection: 'seba-products'
});

module.exports = mongoose.model('Product', ProductSchema);

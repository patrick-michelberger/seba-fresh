'use strict';

var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  categoryPath: {},
  description: String,
  brand: String,
  quantityOptions: [],
  imageUrl: String,
  productUrl: String,
  stock: Boolean,
  addToCartUrl: String
});

module.exports = mongoose.model('Product', ProductSchema);

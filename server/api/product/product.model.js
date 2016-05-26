'use strict';

import mongoose from 'mongoose';

var ProductSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  categoryPath: String,
  description: String,
  brand: String,
  thumbnailImage: String,
  mediumImage: String,
  largeImage: String,
  productUrl: String,
  stock: Boolean,
  addToCartUrl: String
});

export default mongoose.model('Product', ProductSchema);

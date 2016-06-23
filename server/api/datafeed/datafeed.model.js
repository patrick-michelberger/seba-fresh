'use strict';

// import mongoose from 'mongoose';
var mongoose = require('mongoose');

var DatafeedSchema = new mongoose.Schema({
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
},{
  collection: 'seba-datafeed'
}
);

// export default mongoose.model('Datafeed', DatafeedSchema);
module.exports = mongoose.model('Datafeed', DatafeedSchema);
  

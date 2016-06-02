#!/usr/bin/env node

// CONFIGURATION
var config = {
  "walmart": {
    "key": process.env.WALMART_API_KEY || 'mfx9k9yqyg263ng4x3x9bek2'
  },
  "mongoURI": process.env.MONGOHQ_URL || 'mongodb://localhost/sebafresh-dev'
};

// DEPENDENCIES
var walmart = require('walmart')(config.walmart.key);
var mongoose = require('mongoose');
Product = require('../api/product/product.model');

// CONNECT TO SEBA DATABASE
mongoose.connect(config.mongoURI);

// RUNNING CODE
console.log("Crawling products from Walmart API ...");
walmart.getItem(10449075).then(function (item) {
  var product = item.product;

  product = {
    id: product.productId,
    name: product.productName,
    price: product.buyingOptions.price.currencyAmount,
    categoryPath: product.categoryPath,
    description: product.longDescription,
    brand: product.brand,
    quantityOptions: product.buyingOptions.quantityOptions,
    imageUrl: product.imageAssets.primaryImageUrl,
    productUrl: "http://www.walmart.com/ip/" + product.usItemId,
    stock: true,
    addToCartUrl: "http://www.walmart.com/ip/" + product.usItemId
  };

  Product.create(product, function (err, savedProduct) {
    if (err) {
      console.log("Error: saving product: ", err);
    } else {
      console.log("Product saved: ", savedProduct);
    }
  });
});

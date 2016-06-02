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
var async = require('async');
Product = require('../api/product/product.model');

// CONNECT TO SEBA DATABASE
mongoose.connect(config.mongoURI);

// RUNNING CODE
console.log("Crawling products from Walmart API ...");

// Returns an array of items of the best-sellers on the specified category.
// Food category id = 976759
walmart.feeds.bestSellers(976759).then(function (response) {
  async.each(response.items, function (product, cb) {

    // Parse product for SEBA product model
    product = {
      id: product.itemId,
      name: product.name,
      price: product.salePrice,
      categoryPath: product.categoryPath,
      description: product.shortDescription,
      brand: product.brandName,
      thumbnailImage: product.thumbnailImage,
      mediumImage: product.mediumImage,
      largeImage: product.largeImage,
      productUrl: product.productUrl,
      stock: product.stock,
      addToCartUrl: product.addToCartUrl
    };

    Product.create(product, function (err, savedProduct) {
      if (err) {
        console.log("Error: saving product: ", err);
      }
      cb();
    });
  }, function (err) {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("All products saved!");
      process.exit();
    }
  });
});

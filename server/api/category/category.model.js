'use strict';

var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  categoryPath: String,
  childrens: [{
    id: String,
    name: String
  }]
}, {
  collection: 'seba-categories'
});


module.exports = mongoose.model('Category', CategorySchema);

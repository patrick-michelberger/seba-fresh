'use strict';

var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  categoryPath: String,
  children: [{
    id: String,
    name: String,
    path: String
  }]
}, {
  collection: 'seba-categories'
});

module.exports = mongoose.model('Category', CategorySchema);

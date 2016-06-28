'use strict';

var mongoose = require('mongoose');

var subChildren = {
  id: String,
  name: String,
  path: String
};

var children = {
  id: String,
  name: String,
  path: String,
  children: [ subChildren ]
};

var CategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  path: String,
  children: [ children ]
}, {
  collection: 'seba-categories'
});


module.exports = mongoose.model('Category', CategorySchema);

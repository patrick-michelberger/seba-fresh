'use strict';

import mongoose from 'mongoose';

var GroupSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    street_number: String,
    additional_address: String,
    postcode: String,
    city: String,
    geolocation: {
      latitude: String,
      longitude: String
    }
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  }
}, {
  collection: 'seba-groups'
});

export default mongoose.model('Group', GroupSchema);

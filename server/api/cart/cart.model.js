'use strict';

import mongoose from 'mongoose';

var CartSchema = new mongoose.Schema({
  "items": [{
    "product": {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: []
    },
    "user": {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    "quantity": {
      type: Number,
      default: 1
    }
  }],
  "group": {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  "totalAmount": {
    type: Number,
    default: 0
  }
},   {
  collection: 'seba-carts'
});

export default mongoose.model('Cart', CartSchema);

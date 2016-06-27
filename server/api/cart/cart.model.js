'use strict';

import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

var CartSchema = new mongoose.Schema({
  "items": [{
    "product": {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      autopopulate: true,
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

var autoPopulateLead = function (next) {
  this.populate('items.product items.user');
  next();
};

CartSchema.plugin(autopopulate);

export default mongoose.model('Cart', CartSchema);

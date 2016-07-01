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
    "user": {},
    "quantity": {
      type: Number,
      default: 1
    }
  }],
  "group": {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  "users": [{
    "_id": mongoose.Schema.Types.ObjectId,
    "first_name": String,
    "last_name": String,
    "totalAmount": Number,
    "totalQuantity": Number,
    "paymentType": String
  }],
  "totalAmount": {
    type: Number,
    default: 0
  },
  "totalQuantity": {
    type: Number,
    default: 0
  }
},   {
  collection: 'seba-carts'
});

// middleware
var autoPopulateLead = function (next) {
  this.populate('items.product items.user');
  next();
};

CartSchema.plugin(autopopulate);

CartSchema.pre('remove', function (next) {
  this.model('Cart').remove({
    group: this._id
  }, next);
});

export default mongoose.model('Cart', CartSchema);

'use strict';

import mongoose from 'mongoose';

var PaymentSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  Paypal_id: String,
  user_id: String,
  amount_due: Number,
  amount_paid: Number,
  auto_payment: Boolean,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

}, {
  collection: 'seba-payments'
});

export default mongoose.model('Payment', PaymentSchema);

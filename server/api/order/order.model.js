'use strict';

import mongoose from 'mongoose';

var OrderSchema = new mongoose.Schema({
  order_id: Number,
  user_id: String,
  order_number: Number,
  payment_id: String,
  order_date: String,
  ship_date: String,
  delivery_date: String,
  Shipper_id: String,
  timestamp: String,
  payment_date: String,
  order_total: Number
}, {
  collection: 'seba-orders'
});

export default mongoose.model('Order', OrderSchema);

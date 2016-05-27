'use strict';

import mongoose from 'mongoose';

var PaymentSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Payment', PaymentSchema);

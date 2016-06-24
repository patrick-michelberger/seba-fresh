'use strict';

import mongoose from 'mongoose';

var CartSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Cart', CartSchema);

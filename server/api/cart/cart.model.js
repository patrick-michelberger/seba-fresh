'use strict';

import mongoose from 'mongoose';

var CartSchema = new mongoose.Schema({
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: []
  }],
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }
});

export default mongoose.model('Cart', CartSchema);

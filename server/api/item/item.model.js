'use strict';

import mongoose from 'mongoose';

var ItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  quantity: Number
});

export default mongoose.model('Item', ItemSchema);

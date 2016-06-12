'use strict';

import mongoose from 'mongoose';

var GroupSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    street_number: String,
    additional_address: String,
    postcode: String,
    city: String
  }
}, {
  collection: 'seba-groups'
});

export default mongoose.model('Group', GroupSchema);

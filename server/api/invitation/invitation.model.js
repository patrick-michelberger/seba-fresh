'use strict';

import mongoose from 'mongoose';

var InvitationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: String,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }
}, {
  collection: 'seba-invitations'
});

export default mongoose.model('Invitation', InvitationSchema);

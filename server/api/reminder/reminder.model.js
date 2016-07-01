'use strict';

import mongoose from 'mongoose';

var ReminderSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }
}, {
  collection: 'seba-reminders'
});


export default mongoose.model('Reminder', ReminderSchema);

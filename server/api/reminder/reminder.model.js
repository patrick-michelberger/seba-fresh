'use strict';

import mongoose from 'mongoose';

var ReminderSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Reminder', ReminderSchema);

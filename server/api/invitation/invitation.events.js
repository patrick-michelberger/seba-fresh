/**
 * Invitation model events
 */

'use strict';

import {EventEmitter} from 'events';
import Invitation from './invitation.model';
var InvitationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
InvitationEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Invitation.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    InvitationEvents.emit(event + ':' + doc._id, doc);
    InvitationEvents.emit(event, doc);
  }
}

export default InvitationEvents;

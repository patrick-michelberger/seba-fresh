/**
 * Cart model events
 */

'use strict';

import {EventEmitter} from 'events';
import Cart from './cart.model';
var CartEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CartEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Cart.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CartEvents.emit(event + ':' + doc._id, doc);
    CartEvents.emit(event, doc);
  }
}

export default CartEvents;

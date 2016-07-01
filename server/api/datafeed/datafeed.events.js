/**
 * Datafeed model events
 */

'use strict';

import {EventEmitter} from 'events';
import Datafeed from './datafeed.model';
var DatafeedEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DatafeedEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Datafeed.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    DatafeedEvents.emit(event + ':' + doc._id, doc);
    DatafeedEvents.emit(event, doc);
  }
}

export default DatafeedEvents;

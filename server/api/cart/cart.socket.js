/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import CartEvents from './cart.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  console.log("currentCart: ", socket.currentCart);
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('cart:' + socket.currentCart + ":" + event, socket);
    CartEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}


function createListener(event, socket) {
  return function (doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function () {
    CartEvents.removeListener(event, listener);
  };
}

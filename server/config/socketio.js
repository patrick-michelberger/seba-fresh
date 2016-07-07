/**
 * Socket.io configuration
 */
'use strict';

import config from './environment';
import Cart from '../api/cart/cart.model';

// When the user disconnects.. perform this
function onDisconnect(socket) {
  if (socket.decoded_token && socket.decoded_token._id) {
    var userId = socket.decoded_token._id;
    connectedUsers[userId] = null;
  }
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });

  if (socket.decoded_token && socket.decoded_token._id) {
    var userId = socket.decoded_token._id;
    connectedUsers[userId] = socket;
  }

  // user joins group chats for all in cart
  Cart.findOne({
    'users._id': userId
  }).exec().then(function (foundCart) {
    if (foundCart) {
      socket.join(foundCart._id);
    }
    socket.currentCart = foundCart._id;
    require('../api/cart/cart.socket').register(socket);
  }, function (err) {
    if (err) {
      console.log("error: ", err);
    }
  });

  // Insert sockets below
  require('../api/reminder/reminder.socket').register(socket);
  require('../api/invitation/invitation.socket').register(socket);
  require('../api/category/category.socket').register(socket);
  require('../api/group/group.socket').register(socket);
  require('../api/order/order.socket').register(socket);
  require('../api/payment/payment.socket').register(socket);
  require('../api/product/product.socket').register(socket);
}

// Store sockets by user id
var connectedUsers = {};

export default function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  socketio.use(require('socketio-jwt').authorize({
    secret: config.secrets.session,
    handshake: true
  }));

  socketio.on('connection', function (socket) {
    socket.address = socket.request.connection.remoteAddress +
      ':' + socket.request.connection.remotePort;

    socket.connectedAt = new Date();

    socket.log = function (...data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
    };

    // Call onDisconnect.
    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });

    // Call onConnect.
    onConnect(socket);
    socket.log('CONNECTED');
  });
}

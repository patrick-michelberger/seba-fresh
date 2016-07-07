/* global io */
'use strict';

angular.module('sebaFreshApp')
  .factory('socket', function (socketFactory, Auth) {
    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      'query': 'token=' + Auth.getToken(),
      'path': '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket
    });

    return {
      socket,

      /**
       * Register document specific listeners to sync an object with updates on a model
       *
       * Takes the object we want to sync, the model name and Id that socket updates are sent from,
       * and an optional callback function after the object is updated.
       *
       * @param {String} modelName
       * @param {String} modelId
       * @param {object} object
       * @param {Function} cb
       */
      syncModelUpdates(modelName, modelId, object, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:modelId:save'
         */
        socket.on(modelName + ':' + modelId + ':save', function (model) {
          if (Object.keys(object).length < 1) {
            event = 'created';
          } else {
            event = 'updated';
          }
          console.log("old amount: ", object.totalAmount);
          _.merge(object, model);
          console.log("New amount: ", object.totalAmount);
          cb(event, object);
        });

        /**
         * Syncs removed items on 'model:modelId:remove'
         */
        socket.on(modelName + ':' + modelId + ':remove', function (model) {
          console.log(modelName + ':' + modelId + ':remove');
          var event = 'deleted';
          cb(event, null);
        });
      },

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {
            _id: item._id
          });
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {
            _id: item._id
          });
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates(modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  });

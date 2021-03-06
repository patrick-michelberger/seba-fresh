/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/carts              ->  index
 * POST    /api/carts              ->  create
 * GET     /api/carts/:id          ->  show
 * PUT     /api/carts/:id          ->  update
 * DELETE  /api/carts/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Cart from './cart.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function addItemToCart(req) {
  var data = req.body;
  var userId = req.user._id;
  return function (cart) {
    var user = _.find(cart.users, {
      "_id": userId
    });
    user.items = addToItems(user.items, data.product);
    return cart.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeItemFromCart(req) {
  var data = req.body;
  var userId = req.user._id;
  return function (cart) {
    var user = _.find(cart.users, {
      "_id": userId
    });
    user.items = removeFromItems(user.items, data.product);
    return cart.save()
      .then(updated => {
        return updated;
      });
  };
}

function addToItems(items, product) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (String(item.product._id) == product._id) {
      item.quantity += 1;
      return items;
    }
  }
  items.push({
    product: product,
    quantity: 1
  });
  return items;
}

function removeFromItems(items, product) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.product._id == product._id) {
      if (item.quantity <= 1) {
        items.splice(i, 1);
      } else {
        item.quantity -= 1;
      }
    }
  }
  return items;
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Carts
export function index(req, res) {
  var userId = req.user._id;
  return Cart.find({
      'users._id': userId
    })
    .populate('items.product items.user')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Get user's current cart
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return Cart.findOne({
      'users._id': userId
    }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Cart from the DB
export function show(req, res) {
  return Cart.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Cart in the DB
export function create(req, res) {
  return Cart.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Add an item to the cart
export function addItem(req, res) {
  return Cart.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(addItemToCart(req))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Remove an item from the cart
export function removeItem(req, res) {
  return Cart.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeItemFromCart(req))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Updates an existing Cart in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Cart.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Cart from the DB
export function destroy(req, res) {
  return Cart.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

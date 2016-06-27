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

function addItemToCart(data) {
  return function (cart) {
    cart.items = addToItems(cart.items, data.product._id, data.userId);
    cart.totalAmount += data.product.price;
    return cart.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeItemFromCart(data) {
  return function (cart) {
    cart.items = removeFromItems(cart.items, data.product._id, data.userId, data.quantity);
    cart.totalAmount -= data.product.price * data.quantity;
    return cart.save()
      .then(updated => {
        return updated;
      });
  };
}

function addToItems(items, productId, userId) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.product == productId && item.user == userId) {
      item.quantity += 1;
      return items;
    }
  }
  items.push({
    product: productId,
    user: userId
  });
  return items;
}

function removeFromItems(items, productId, userId, quantity) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.product == productId && item.user == userId) {
      if (item.quantity >= quantity) {
        items.splice(i, 1);
      } else {
        item.quantity -= quantity;
      }
    }
  }
  console.log("items to remove: ", items);
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
  return Cart.find().populate('items.product items.user').exec()
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
    .then(addItemToCart(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Remove an item from the cart
export function removeItem(req, res) {
  return Cart.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeItemFromCart(req.body))
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

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/groups              ->  index
 * POST    /api/groups              ->  create
 * GET     /api/groups/:id          ->  show
 * PUT     /api/groups/:id          ->  update
 * DELETE  /api/groups/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Group from './group.model';
import Cart from '../cart/cart.model';

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

function saveInvitee(invitee) {
  var userId = invitee.id;
  return function (entity) {
    entity.users.push(userId);
    return entity.save()
      .then(updated => {
        return updated;
      });
  };
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

// Gets a list of Groups
export function index(req, res) {
  var userId = req.user._id;
  return Group.find({
      "$or": [{
        admin: userId
      }, {
        users: userId
      }]
    })
    .populate('admin', 'first_name last_name picture')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Group from the DB
export function show(req, res) {
  return Group.findById(req.params.id)
    .populate('admin', 'first_name last_name picture')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Group in the DB
export function create(req, res) {
  var user = req.user;
  return Group.create(req.body)
    .then(function (createdGroup) {
      var cart = {
        items: [],
        group: createdGroup._id,
        users: [{
          "_id": user._id,
          "first_name": user.first_name,
          "last_name": user.last_name,
          "picture": user.picture
          }],
        totalAmount: 0
      };
      Cart.create(cart).then(function (createdCart) {
          res.status(201).json({
            cart: createdCart,
            group: createdGroup
          });
        })
        .catch(handleError(res));
    })
    .catch(handleError(res));
}

// Adds a user to a group
export function acceptInvitation(req, res) {
  var user = req.user;
  return Group.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveInvitee(req.body))
    .then(function (updatedGroup) {
      return Cart.findOne({
        'group': updatedGroup._id
      }).exec().then(function (foundCart) {
        var userExists = false;
        for (var i = 0; i < foundCart.users.length; i++) {
          if (foundCart.users[i]._id.equals(req.user._id)) {
            userExists = true;
            break;
          }
        }
        if (userExists) {
          respondWithResult(res)(updatedGroup);
        } else {
          foundCart.users.push({
            "_id": req.user._id,
            "first_name": req.user.first_name,
            "last_name": req.user.last_name
          });
          foundCart.save().then(function (err) {
            if (err) {
              console.log("Error: ", err);
            }
            respondWithResult(res)(updatedGroup);
          });
        }
      });
    })
    .catch(handleError(res));
}

// Updates an existing Group in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Group.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Group from the DB
export function destroy(req, res) {
  return Group.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(function (foundGroup) {
      var query = {
        "group": foundGroup._id
      };
      Cart.findOne(query).then(function (foundCart) {
        foundCart.remove()
          .then(() => {
            removeEntity(res)(foundGroup);
          });
      });
    })
    .catch(handleError(res));
}

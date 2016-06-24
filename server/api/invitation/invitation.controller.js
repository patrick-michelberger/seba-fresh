/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/invitations              ->  index
 * POST    /api/invitations              ->  create
 * GET     /api/invitations/:id          ->  show
 * PUT     /api/invitations/:id          ->  update
 * DELETE  /api/invitations/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Invitation from './invitation.model';
import config from '../../config/environment';
import mail from '../../components/mail';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    console.log("respond with result: ", entity);
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
    console.log("ERROR: ", err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Invitations
export function index(req, res) {
  return Invitation.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Invitation from the DB
export function show(req, res) {
  return Invitation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Invitation in the DB
export function create(req, res) {
  return Invitation.create(req.body)
    .then(function (createdInvitation) {
      var data = {
        to: createdInvitation.to,
        template: 'invite.hbs',
        subject: 'SEBA fresh invitation',
        payload: {
          user: req.use,
          group: createdInvitation.group,
          url: config.domain + '/group/' + createdInvitation.group
        }
      };
      mail.send(data, function (err) {
        if (err) {
          console.log("Error: sending invitation mail: ", err);
        }
        respondWithResult(res, 201)(createdInvitation);
      });
    }).catch(handleError(res));
}

// Updates an existing Invitation in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Invitation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Invitation from the DB
export function destroy(req, res) {
  return Invitation.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/*function (req, statusCode) {
  console.log("invitation created");
  var userId = req.user._id;
  var groupId = req.body.group._id;
  var data = {
    from: userId,
    to: req.body.to,
    group: groupId,
    url: config.domain + '/#/join/' + groupId,
    user: req.user,
    template: 'invite.hbs',
    subject: 'SEBA fresh invitation'
  };
  mail.send(data, function (err) {
    console.log("send data");
    if (err) {
      console.log("Error: sending invitation mail: ", err);
    }
    respondWithResult(res, 201);
  });
}*/

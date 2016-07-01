/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/payments              ->  index
 * POST    /api/payments              ->  create
 * GET     /api/payments/:id          ->  show
 * PUT     /api/payments/:id          ->  update
 * DELETE  /api/payments/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Payment from './payment.model';
import mail from '../../components/mail';
import Group from '../group/group.model';
import config from '../../config/environment';
import Cart from '../cart/cart.model';
import User from '../user/user.model';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Payments
export function index(req, res) {
  return Payment.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Payment from the DB
export function show(req, res) {
  return Payment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Creates a new Payment in the DB and sends the payment request to individual users of a group
export function create(req, res) {
  return Payment.create(req.body)
    .then(function (createPayment){

      // console.log(createPayment);
      // console.log(req);


	var paidByUser = {};
	var groupId = createPayment.group;
	var cartId = createPayment.cart;


  console.log('groupId:'+groupId);
  console.log('cartId:'+cartId);
  console.log('paidby:'+createPayment.paidBy);

 // The mail is send from this user to all
	User.findById(createPayment.paidBy).exec(function(err, user) {
    console.log('userObject:   '+user);
	paidByUser = user;
	  });

      // Find all the users in this group
      Group.findById(groupId).populate('users').exec(function(err, group) {
        console.log('groupObject :', group.users);


	  var invidualPrice = 0.0;

	  // Find the items in the cart added by the particular user
	  Cart.findById(cartId).populate('items').exec(function(err, items) {
       console.log('items objects:', items);

	   // logic to read the items which the user has added and find the price

	   });

	   // https://www.paypal.com/cgi-bin/webscr?business=riswan_27%40pec.edu&cmd=_xclick&currency_code=EUR&amount=100&item_name=your+share+of+cart+2230
	   // form paypal pay url

	   var string1 = 'https://www.paypal.com/cgi-bin/webscr?business=';
	   var string2 = paidByUser.email;
	   var string3 = '&cmd=_xclick&currency_code=EUR&amount=';
	   var string4 = invidualPrice.toString();
	   var string5 = '&item_name=Your+share+of+Cart+';
       var string6 = cartId.toString();

       var url = string1.concat(string2,string3,string4,string5,string6);


       var data = {
       //  to: createPayment.to,
        to: 'mohamed.riswan.1n1ly@gmail.com', // should have the user id
         template: 'paymentEmail.hbs',
         subject: 'SEBA fresh Payments',
         payload: {
		       paidbyUser: paidByUser,
           user: req.user,
           group: group,
           url: url,
           cartId: cartId,
         }
       };
       mail.send(data, function (err) {
         if (err) {
           console.log("Error: sending payment mail: ", err);
         }
         respondWithResult(res, 201)(createPayment);
       });




      });
  }).catch(handleError(res));
}


// Updates an existing Payment in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Payment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Payment from the DB
export function destroy(req, res) {
  return Payment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

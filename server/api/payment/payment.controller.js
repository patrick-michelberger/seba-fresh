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
import request from 'request';


function calculateOrderAmount(items) {
  var value = 0;
  if (items) {
    items = items ||  [];
    items.forEach(function (item) {
      value += item.quantity;
    });
  }
  return value;
}

function sendPaymentRequest(sender, receiver, amount, cart, callback) {
  var paypalAPIkey = '';
  var paymentURL = '';
  var returnUrl = config.domain + '/carts/' + cart._id + '/pay';
  var failUrl = config.domain + '/carts/' + cart._id + '/cancel';

  sender.email = "patrick.michelberger@tum.de";

  // Get the api key from paypal, form the url and then send it to the individualUsers
  //checking paypal post request
  var postData = {
    "actionType": "PAY", // Payment action type
    "currencyCode": "EUR", // Payment currency code
    "receiverList": {
      "receiver": [{
        "amount": amount, // Payment amount
        "email": sender.email // Payment ReceiTODOver's email address
      }]
    },
    "returnUrl": returnUrl, // Where to redirect the Sender following a successful payment approval
    "cancelUrl": failUrl, // Where to redirect the Sender following a canceled payment
    "requestEnvelope": {
      "errorLanguage": "en_US", // Language used to display errors
      "detailLevel": "ReturnAll" // Error detail level
    }
  };

  var reqHeaders = {
    'X-PAYPAL-SECURITY-USERID': 'caller_1312486258_biz_api1.gmail.com',
    'X-PAYPAL-SECURITY-PASSWORD': '1312486294',
    'X-PAYPAL-SECURITY-SIGNATURE': 'AbtI7HV1xB428VygBUcIhARzxch4AL65.T18CTeylixNNxDZUu0iO87e',

    // Global Sandbox Application ID
    // TODO Change to real app id
    'X-PAYPAL-APPLICATION-ID': 'APP-80W284485P519543T',

    // Input and output formats
    'X-PAYPAL-REQUEST-DATA-FORMAT': 'JSON',
    'X-PAYPAL-RESPONSE-DATA-FORMAT': 'JSON',
  };

  // TODO Change to real url
  var url = 'https://svcs.sandbox.paypal.com/AdaptivePayments/Pay';
  var options = {
    method: 'post',
    headers: reqHeaders,
    body: postData,
    json: true,
    url: url
  };
  request(options, function (err, res, body) {
    if (err) {
      console.log('error in response: ' + err)
      return
    }
    var headers = res.headers;
    var statusCode = res.statusCode;

    if (body !== undefined) {
      var paymentURL = 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=' + body.payKey;
      if (paymentURL === '') {

        // no api key generated, create a paymentURL manually for the user
        // https://www.paypal.com/cgi-bin/webscr?business=riswan_27%40pec.edu&cmd=_xclick&currency_code=EUR&amount=100&item_name=your+share+of+cart+2230
        // form paypal pay url

        var string1 = 'https://www.paypal.com/cgi-bin/webscr?business=';
        var string2 = sender.email;
        var string3 = '&cmd=_xclick&currency_code=EUR&amount=';
        var string4 = usersInCart[i].totalAmount.toString();
        var string5 = '&item_name=Your+share+of+Cart+';
        var string6 = cartId.toString();

        paymentURL = string1.concat(string2, string3, string4, string5, string6);

      }

      // Form the mail data
      var data = {
        //  to: createPayment.to,
        to: 'mohamed.riswan.1n1ly@gmail.com', // should have the user id
        template: 'paymentEmail.hbs',
        subject: 'SEBA fresh Payments',
        payload: {
          paidbyUser: sender,
          user: receiver,
          url: paymentURL
        }
      };
      mail.send(data, function (err) {
        if (err) {
          console.log("Error: sending payment mail: ", err);
        }
        callback();
      });

    }

  });
}

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


export function sendRequest(req, res) {
  var payerId = req.body.payer;
  var cartId = req.body.cart;
  return Cart.findById(cartId)
    .populate('group')
    .populate('users')
    .exec()
    .then(handleEntityNotFound(res))
    .then(function (foundCart) {
      var user = {};
      for (var i = 0; i < foundCart.users.length; i++) {
        if (String(foundCart.users[i]._id) === payerId) {
          user = foundCart.users[i];
        }
      }
      var amount = calculateOrderAmount(user.items);
      User.findById(payerId).exec(function (err, payer) {
        var admin = foundCart.group.admin;
        sendPaymentRequest(payer, admin, amount, foundCart, function () {
          respondWithResult(res)({
            "paymentRequestSent": true
          });
        });
      });
    });
}

// Creates a new Payment in the DB and sends the payment request to individual users of a group
export function create(req, res) {
  return Payment.create(req.body)
    .then(respondWithResult(res))
    .catch(handleError(res));
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

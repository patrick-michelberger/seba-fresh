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
      // Group.findById(groupId).populate('users').exec(function(err, group) {
      //   console.log('groupObject :', group.users);


	  var invidualPrice = 0.0;
    var usersInCart = {};
    var individualUser = {};
	  // Find the items in the cart added by the particular user
	  Cart.findById(cartId).populate('users').exec(function(err, cart) {
       console.log('Users in the cart:', cart);
       usersInCart = cart.users;
	   // logic to read the items which the user has added and find the price
	  // });





     // Send payment mail to all users in the cart
     for(var i=0;i<usersInCart.length;i++){

	var paypalAPIkey = '';
	var paymentURL = '';

       User.findById(usersInCart[i]._id).exec(function(err, user) {
          console.log('individualUser:   '+user);
      	individualUser = user;
      	  });



// Get the api key from paypal, form the url and then send it to the individualUser


	  //checking paypal post request
	  var postData = {
  "actionType":"PAY",                               // Payment action type
  "currencyCode":"EUR",                             // Payment currency code
  "receiverList":{
    "receiver":[{
      "amount":usersInCart[i].totalAmount.toString(),                              // Payment amount
      "email": paidByUser.email    // Payment Receiver's email address
    }]
  },
  "returnUrl":"http://Payment-Success-URL", // Where to redirect the Sender following a successful payment approval
  "cancelUrl":"http://Payment-Cancel-URL",  // Where to redirect the Sender following a canceled payment
  "requestEnvelope":{
  "errorLanguage":"en_US",                          // Language used to display errors
  "detailLevel":"ReturnAll"                         // Error detail level
  }
};

var reqHeaders = {

'X-PAYPAL-SECURITY-USERID' : 'caller_1312486258_biz_api1.gmail.com',
'X-PAYPAL-SECURITY-PASSWORD' : '1312486294',
'X-PAYPAL-SECURITY-SIGNATURE' : 'AbtI7HV1xB428VygBUcIhARzxch4AL65.T18CTeylixNNxDZUu0iO87e',

// Global Sandbox Application ID
'X-PAYPAL-APPLICATION-ID' : 'APP-80W284485P519543T',

// Input and output formats
'X-PAYPAL-REQUEST-DATA-FORMAT' : 'JSON',
'X-PAYPAL-RESPONSE-DATA-FORMAT' : 'JSON',
};



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
    console.log('error in response: '+err)
    return
  }
  var headers = res.headers
  var statusCode = res.statusCode
  console.log('headers: ', headers)
  console.log('status code: ', statusCode)
  console.log('body : ',  body)
  if(body != undefined){
  console.log('paykey:', body.payKey)

  var paymentURL = 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey='+body.payKey;

  console.log('paymentURL:', paymentURL )
  }

});

if(paymentURL == ''){

     // no api key generated, create a paymentURL manually for the user
	   // https://www.paypal.com/cgi-bin/webscr?business=riswan_27%40pec.edu&cmd=_xclick&currency_code=EUR&amount=100&item_name=your+share+of+cart+2230
	   // form paypal pay url

	   var string1 = 'https://www.paypal.com/cgi-bin/webscr?business=';
	   var string2 = paidByUser.email;
	   var string3 = '&cmd=_xclick&currency_code=EUR&amount=';
	   var string4 = usersInCart[i].totalAmount.toString();
	   var string5 = '&item_name=Your+share+of+Cart+';
     var string6 = cartId.toString();

    paymentURL = string1.concat(string2,string3,string4,string5,string6);

}




// Form the mail data
       var data = {
       //  to: createPayment.to,
        to: individualUser.email,                     //'mohamed.riswan.1n1ly@gmail.com', // should have the user id
         template: 'paymentEmail.hbs',
         subject: 'SEBA fresh Payments',
         payload: {
		       paidbyUser: paidByUser,
           user: individualUser,
           group: group,
           url: paymentURL,
           cartId: cartId,
         }
       };
       mail.send(data, function (err) {
         if (err) {
           console.log("Error: sending payment mail: ", err);
         }
         respondWithResult(res, 201)(createPayment);
       });


     }

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

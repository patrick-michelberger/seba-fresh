 'use strict';

 import mongoose from 'mongoose';
 import autopopulate from 'mongoose-autopopulate';

 var item = {
   "product": {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Product',
     autopopulate: true,
     default: []
   },
   "quantity": {
     type: Number,
     default: 1
   }
 };

 var CartSchema = new mongoose.Schema({
   "group": {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Group',
     autopopulate: true
   },
   "users": [{
     "_id": mongoose.Schema.Types.ObjectId,
     "items": [item],
     "first_name": String,
     "last_name": String,
     "picture": String,
     "paymentType": String
  }]
 }, {
   toObject: {
     virtuals: true
   },
   toJSON: {
     virtuals: true
   },
   collection: 'seba-carts'
 });


 // Virtual properties
 CartSchema
   .virtual('totalAmount')
   .get(function () {
     var totalAmount = 0;
     for (var i = 0; i < this.users.length; i++) {
       for (var x = 0; x < this.users[i].items.length; x++) {
         var price = this.users[i].items[x].product.price * this.users[i].items[x].quantity;
         totalAmount = totalAmount + price;
       }
     }
     parseFloat(totalAmount).toFixed(2);
     return totalAmount;
   });

 CartSchema
   .virtual('totalQuantity')
   .get(function () {
     var totalQuantity = 0;
     for (var i = 0; i < this.users.length; i++) {
       for (var x = 0; x < this.users[i].items.length; x++) {
         totalQuantity += this.users[i].items[x].quantity;
       }
     }
     return totalQuantity;
   });

 // middleware
 var autoPopulateLead = function (next) {
   this.populate('users.items user.group');
   next();
 };

 CartSchema.plugin(autopopulate);

 CartSchema.pre('remove', function (next) {
   this.model('Cart').remove({
     'group._id': this._id
   }, next);
 });

 export default mongoose.model('Cart', CartSchema);

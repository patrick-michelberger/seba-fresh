/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import product from '../api/product/product.model';
import payment from '../api/payment/payment.model';
import order from '../api/order/order.model';
/*
User.find({}).remove()
  .then(() => {
    User.create({
        provider: 'local',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'test'
      }, {
        provider: 'local',
        role: 'admin',
        first_name: 'Mr',
        last_name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      }, {

        user_name: 'User_1',
        last_name: 'Root',
        first_name: 'Joe',
        email: 'joe@test.com',
        auto_payment: '0',
        Paypal_id: '7u67ty67uikjh4359i846r5tebdgf65t',
        date_joined: '12.05.2016',
        status: '1',
        activated: '1',
        user_id: 'Joe',
        date_of_birth: '12.05.1990',
        room: '3',
        building: '4',
        Address_1: 'Sonnestrasse',
        Address_2: 'Mark Street',
        city: 'Munich',
        state: 'Bavaria',
        postal_code: '81375',
        country: 'Germany',
        phone: '7869874352',
        password: 'passwordjoe'
      }, {
        user_name: 'User_2',
        last_name: 'Seth',
        first_name: 'Rogen',
        email: 'seth@test.com',
        auto_payment: '0',
        Paypal_id: 'y675ut898765trh47u68tuykn5647583',
        date_joined: '12.05.2016',
        status: '1',
        activated: '1',
        user_id: 'Seth',
        date_of_birth: '12.05.1991',
        room: '4',
        building: '5',
        Address_1: 'Sonnestrasse',
        Address_2: 'Joe Street',
        city: 'Munich',
        state: 'Bavaria',
        postal_code: '81355',
        country: 'Germany',
        phone: '8773524152',
        password: 'passwordseth'
      }, {
        user_name: 'User_3',
        last_name: 'Nannes',
        first_name: 'Jessie',
        email: 'jessie@test.com',
        auto_payment: '0',
        Paypal_id: '7u657ryt9876hgt546yr55463er4t5g5',
        date_joined: '12.02.2016',
        status: '1',
        activated: '1',
        user_id: 'Jessie',
        date_of_birth: '12.05.1992',
        room: '5',
        building: '6',
        Address_1: 'Sonnestrasse',
        Address_2: 'Seth Street',
        city: 'Munich',
        state: 'Bavaria',
        postal_code: '84355',
        country: 'Germany',
        phone: '8956476584',
        password: 'passwordjessie'
      }, {
        user_name: 'User_5',
        last_name: 'Jones',
        first_name: 'Andrew',
        email: 'andrew@test.com',
        auto_payment: '1',
        Paypal_id: '78u76534254125tr98uy674er5643174',
        date_joined: '12.03.2016',
        status: '1',
        activated: '1',
        user_id: 'Andrew',
        date_of_birth: '12.05.1993',
        room: '6',
        building: '18',
        Address_1: 'Sonnestrasse',
        Address_2: 'Jessie Street',
        city: 'Munich',
        state: 'Bavaria',
        postal_code: '84855',
        country: 'Germany',
        phone: '8986454325',
        password: 'passwordandrew'
      })
      .then(() => {
        console.log('finished populating users');
      })
  });
  */

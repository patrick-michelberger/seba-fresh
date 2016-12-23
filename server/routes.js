/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {

  // Insert routes below
  app.use('/api/categories', require('./api/category'));
  app.use('/api/payments', require('./api/payment'));
  app.use('/api/products', require('./api/product'));

  app.route('/channel.html').get((req, res) => {
    res.sendFile(path.resolve(app.get('serverPath') + '/views/channel.html'));
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}

/**
 * server.js: Defines all the route handlers and middleware for service
 */

const serverless = require('serverless-http');
const express = require('express');
const logger = require('./utils/logger');
const errors = require('./utils/errors');
const helloworldRoutes = require('./routes/helloworld');

const app = express();

app.use(logger.httpLogger); // Must be before any route handlers
app.get('/', helloworldRoutes.getHello);
app.use(errors.invalidRoute); // Must occur after all route handlers
app.use(logger.errorLogger); // Must be before any error handlers
app.use(errors.errorHandler);

module.exports.handler = function (event, context, callback) {
  // Immediate response for WarmUP plugin to save costs/resourcing
  if (event.source === 'serverless-plugin-warmup') {
    logger.info('Received Lambda WarmUp Call');
    return callback(null, 'Lambda is warm');
  }
  return serverless(app)(event, context, callback);
};

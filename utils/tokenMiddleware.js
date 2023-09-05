// ../utils/tokenMiddleware.js

const jwt = require('jsonwebtoken');

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.substring(7); // Remove 'Bearer ' prefix
  } else {
    request.token = null;
  }
  next();
};

module.exports = tokenExtractor;
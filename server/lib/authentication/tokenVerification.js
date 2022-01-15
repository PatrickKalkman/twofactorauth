const tokenVerification = {};

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const log = require('../log');

tokenVerification.extractAndVerifyJwtToken = function (request, cb) {
  if (typeof request.headers.authorization === 'undefined') {
    cb(new Error('No token provided'), false);
  }

  const auth = request.headers.authorization;
  const tokens = auth.split(' ');
  if (tokens.length < 2) {
    cb(new Error('No token provided'), false);
  }

  try {
    const bearerToken = tokens[1];
    jwt.verify(bearerToken, config.jwt.secret, (err) => {
      if (!err) {
        const decoded = jwt.decode(bearerToken);
        cb(null, true, decoded.email);
      } else {
        cb(err, false, null);
      }
    });
  } catch (err) {
    log.error(err);
  }
};

module.exports = tokenVerification;

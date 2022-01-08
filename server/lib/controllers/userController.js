const userController = {};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const log = require('../log');
const db = require('../db/db');
const config = require('../config/config');
const tokenVerification = require('../authentication/tokenVerification');

userController.register = function (req, reply) {
  if (isValidUserRequest(req)) {
    const hashedPassword = hashPassword(req.body.password);
    db.addUser(req.body.email, hashedPassword);
    const user = { email: req.body.email };
    user.token = jwt.sign(user, config.jwt.secret);
    delete user.password;
    reply.code(200).send(user);
  }
  reply.badRequest();
};

userController.login = function (req, reply) {
  if (isValidUserRequest(req)) {
    let user = db.getCleanedUser(req.body.email);
    if (typeof user !== 'undefined') {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        delete user.password;
        user.token = jwt.sign(user, config.jwt.secret);
        reply.code(200).send(user);
      }
    }
  }
  reply.unauthorized('Invalid login. Please try again.');
};

userController.enableTwoFactorAuthStep1 = function (req, reply) {
  tokenVerification.extractAndVerifyToken(req, (err, isValidToken, email) => {
    if (!err && isValidToken) {
      const secret = speakeasy.generateSecret();
      db.updateUserSecret(email, secret);
      qrcode.toDataURL(secret.otpauth_url, function (err, qrImage) {
        if (!err) {
          reply.code(200).send({ qr: qrImage, secret: secret });
        } else {
          reply.internalServerError(err);
        }
      });
    } else {
      reply.unauthorized(err);
    }
  });
};

userController.validateToken = function (req, reply) {
  tokenVerification.extractAndVerifyToken(req, (err, isValidJwtToken, email) => {
    if (!err && isValidJwtToken) {
      const user = db.getUser(email);
      if (typeof user !== 'undefined') {
        log.info(user);
        const base32secret = user.twoFactorSecret.base32;
        const userToken = req.body.token;
        const verified = speakeasy.totp.verify({ secret: base32secret, encoding: 'base32', token: userToken });
        if (verified) {
          // User has successfully enable two factor authentication, update the user record
          log.info('Successfully verified two factor, set to enabled');
          db.enableTwoFactorAuthentication(email);
          reply.code(200).send({ validated: true });
        } else {
          log.info('Token was not verified');
          reply.code(200).send({ validated: false });
        }
      }
    } else {
      reply.unauthorized(err);
    }
  });
};

function isValidUserRequest(req) {
  return req.body && req.body.email && req.body.email.length > 0 && req.body.password && req.body.password.length > 0;
}

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

module.exports = userController;

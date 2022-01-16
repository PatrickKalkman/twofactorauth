const userController = {};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

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
        const token = jwt.sign(user, config.jwt.secret);
        const newUser = { ...user, token };
        reply.code(200).send(newUser);
      }
    }
  }
  reply.unauthorized('Invalid login. Please try again.');
};

userController.enableTwoFactorAuthStep1 = function (req, reply) {
  tokenVerification.extractAndVerifyJwtToken(req, (err, isValidToken, email) => {
    if (!err && isValidToken) {
      const secret = speakeasy.generateSecret();
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

userController.enableTwoFactorAuthStep2 = function (req, reply) {
  tokenVerification.extractAndVerifyJwtToken(req, (err, isValidJwtToken, email) => {
    if (!err && isValidJwtToken) {
      const user = db.getUser(email);
      if (typeof user !== 'undefined') {
        const base32secret = req.body.base32;
        const userToken = req.body.token;
        const verified = speakeasy.totp.verify({ secret: base32secret, encoding: 'base32', token: userToken });
        if (verified) {
          db.enableTwoFactorAuthentication(email, base32secret);
          reply.code(200).send({ validated: true });
        } else {
          reply.code(200).send({ validated: false });
        }
      }
    } else {
      reply.unauthorized(err);
    }
  });
};

userController.validateToken = function (req, reply) {
  tokenVerification.extractAndVerifyJwtToken(req, (err, isValidJwtToken, email) => {
    if (!err && isValidJwtToken) {
      const user = db.getUser(email);
      if (typeof user !== 'undefined') {
        const validated = speakeasy.totp.verify({
          secret: user.secret,
          encoding: 'base32',
          token: req.body.token,
        });
        reply.code(200).send({ validated });
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

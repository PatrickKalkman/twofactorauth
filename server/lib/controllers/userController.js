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
    log.info(req.body.email);
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
  reply.unauthorized();
};

userController.enableTwoFactorAuthStep1 = function (req, reply) {
  tokenVerification.extractAndVerifyToken(req, (err, isValidToken, email) => {
    if (!err && isValidToken) {
      const secret = speakeasy.generateSecret();
      db.updateUserSecret(email, secret);
      qrcode.toDataURL(secret.otpauth_url, function (err, qrImage) {
        if (!err) {
          reply.code(200).send({ qr: qrImage });
        } else {
          reply.internalServerError(err);
        }
      });
    } else {
      reply.unauthorized(err);
    }
  });
};

userController.enableTwoFactorAuthStep2 = function (req, reply) {};

userController.enableTwoFactorAuthStep3 = function (req, reply) {};

function isValidUserRequest(req) {
  return req.body && req.body.email && req.body.email.length > 0 && req.body.password && req.body.password.length > 0;
}

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

module.exports = userController;

const userController = {};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const log = require("../log");
const db = require("../db/db");
const config = require("../config/config");

userController.register = function register(req, reply) {
  try {
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
  } catch (err) {
    log.error(err);
  }
};

userController.login = function login(req, reply) {
  if (isValidUserRequest(req)) {
    let user = db.getUser(req.body.email);
    if (typeof user !== "undefined") {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        delete user.password;
        user.token = jwt.sign(user, config.jwt.secret);
        reply.code(200).send(user);
      }
    }
  }
  reply.unauthorized();
};

function isValidUserRequest(req) {
  return (
    req.body &&
    req.body.email &&
    req.body.email.length > 0 &&
    req.body.password &&
    req.body.password.length > 0
  );
}

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

module.exports = userController;

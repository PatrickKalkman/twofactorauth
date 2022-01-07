/*
 * db wrapper
 */
var locallydb = require('locallydb');
const config = require('../config/config');
const log = require('../log');

const db = {};

db.initialize = function () {
  db.instance = new locallydb(config.database.folder);
  db.users = db.instance.collection('users');
};

db.isValidUser = function (email, hashedPassword) {
  const user = db.getUser(email, hashedPassword);
  return user.email !== undefined;
};

db.getUser = function (email) {
  const result = db.users.where({ email: email });
  if (
    typeof result != 'undefined' &&
    typeof result.items != 'undefined' &&
    result.items.length > 0 &&
    typeof result.items[0].email !== 'undefined'
  ) {
    return result.items[0];
  }
  return undefined;
};

db.getCleanedUser = function (email) {
  const result = db.users.where({ email: email });
  if (
    typeof result != 'undefined' &&
    typeof result.items != 'undefined' &&
    result.items.length > 0 &&
    typeof result.items[0].email !== 'undefined'
  ) {
    const user = result.items[0];
    return {
      email: user.email,
      password: user.password,
    };
  }
  return undefined;
};

db.addUser = function (email, hashedPassword) {
  const user = db.getUser(email);
  log.info(user);
  if (typeof user === 'undefined' || typeof user.email === 'undefined') {
    db.users.insert({
      email: email,
      password: hashedPassword,
      twoFactorEnabled: false,
      twoFactorSecret: '',
      twoFactorStep: 0,
    });
  }
};

module.exports = db;
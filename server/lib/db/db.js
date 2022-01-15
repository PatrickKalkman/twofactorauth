/*
 * db wrapper
 */
var locallydb = require('locallydb');
const config = require('../config/config');

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
  if (userExists(result)) {
    return result.items[0];
  }
  return undefined;
};

db.getCleanedUser = function (email) {
  const result = db.users.where({ email: email });
  if (userExists(result)) {
    const user = result.items[0];
    return {
      email: user.email,
      password: user.password,
      twoFactorEnabled: user.twoFactorEnabled,
    };
  }
  return undefined;
};

db.addUser = function (email, hashedPassword) {
  const user = db.getUser(email);
  if (typeof user === 'undefined' || typeof user.email === 'undefined') {
    db.users.insert({
      email: email,
      password: hashedPassword,
      twoFactorEnabled: false,
      twoFactorSecret: '',
    });
  }
};

db.updateUserSecret = function (email, secret) {
  const result = db.users.where({ email: email });
  if (userExists(result)) {
    const cid = result.items[0].cid;
    db.users.update(cid, { twoFactorSecret: secret });
  }
};

db.enableTwoFactorAuthentication = function (email, secret) {
  const result = db.users.where({ email: email });
  if (userExists(result)) {
    const cid = result.items[0].cid;
    db.users.update(cid, { twoFactorEnabled: true, secret: secret });
  }
};

function userExists(result) {
  if (
    typeof result != 'undefined' &&
    typeof result.items != 'undefined' &&
    result.items.length > 0 &&
    typeof result.items[0].email !== 'undefined'
  ) {
    return true;
  }
  return false;
}

module.exports = db;

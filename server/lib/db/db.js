/*
 * db wrapper
 */
var locallydb = require("locallydb");
const config = require("../config/config");
const log = require("../log");

const db = {};

db.initialize = function initialize() {
  db.instance = new locallydb(config.database.folder);
  db.users = db.instance.collection("users");
};

db.isValidUser = function isValidUser(email, hashedPassword) {
  const user = db.getUser(email, hashedPassword);
  return user.email !== undefined;
};

db.getUser = function getUser(email) {
  const result = db.users.where({ email: email });
  if (
    typeof result != "undefined" &&
    typeof result.items != "undefined" &&
    result.items.length > 0 &&
    typeof result.items[0].email !== "undefined"
  ) {
    return { email: result.items[0].email, password: result.items[0].password };
  }
  return undefined;
};

db.addUser = function addUser(email, hashedPassword) {
  const user = db.getUser(email);
  if (user.email === undefined) {
    db.users.insert({ email: email, password: hashedPassword });
  }
};

module.exports = db;

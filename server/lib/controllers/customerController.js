const customerController = {};
const fs = require('fs');

const tokenVerification = require('../authentication/tokenVerification');

customerController.get = function (req, reply) {
  tokenVerification.extractAndVerifyJwtToken(req, (err, isValidToken) => {
    if (!err && isValidToken) {
      fs.readFile(__dirname + '/../db/protectedData.json', 'utf8', (err, data) => {
        if (!err) {
          reply.code(200).send(data);
        } else {
          reply.internalServerError(err);
        }
      });
    } else {
      reply.unauthorized(err);
    }
  });
};

module.exports = customerController;

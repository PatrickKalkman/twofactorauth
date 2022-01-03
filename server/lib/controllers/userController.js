const userController = {};

userController.login = function login(req, reply) {
  const { email, password } = req.body;
  reply.unauthorized();
};

userController.register = function register(req, reply) {
  const user = new User(req.body);
  // credentials.password = bcrypt.hashSync(credentials.password, 10);
  // credentials.save((err) => {
  //   if (!err) {
  //     reply.send({ authenticated: true, email: credentials.email, role: "" });
  //   } else {
  //     reply.badRequest(err);
  //   }
  // });
};

userController.login = function login(req, reply) {
  const { email, password } = req.body;
  reply.unauthorized();
};

userController.logout = function logout(req, reply) {
  const { email, password } = req.body;
  reply.unauthorized();
};

module.exports = userController;

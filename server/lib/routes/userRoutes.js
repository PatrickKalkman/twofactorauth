const userController = require("../controllers/userController");

const userRoutes = [
  {
    name: "Login",
    method: "post",
    path: "/api/user/login",
    handler: userController.login,
  },
  {
    name: "Register",
    method: "post",
    path: "/api/user/register",
    handler: userController.register,
  },
];

module.exports = userRoutes;

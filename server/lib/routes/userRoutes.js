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
  {
    name: "Logout",
    method: "post",
    path: "/api/user/logout",
    handler: userController.logout,
  },
];

module.exports = userRoutes;

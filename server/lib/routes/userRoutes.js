const userController = require('../controllers/userController');

const userRoutes = [
  {
    name: 'Login',
    method: 'post',
    path: '/api/user/login',
    handler: userController.login,
  },
  {
    name: 'Register',
    method: 'post',
    path: '/api/user/register',
    handler: userController.register,
  },
  {
    name: 'EnableTwoFactorAuthStep1',
    method: 'post',
    path: '/api/user/enabletwofactorstep1',
    handler: userController.enableTwoFactorAuthStep1,
  },
];

module.exports = userRoutes;

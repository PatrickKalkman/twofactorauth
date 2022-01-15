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
  {
    name: 'EnableTwoFactorAuthStep2',
    method: 'post',
    path: '/api/user/enabletwofactorstep2',
    handler: userController.enableTwoFactorAuthStep2,
  },
  {
    name: 'ValidateToken',
    method: 'post',
    path: '/api/user/validatetoken',
    handler: userController.validateToken,
  },
];

module.exports = userRoutes;

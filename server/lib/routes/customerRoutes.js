const customerController = require("../controllers/customerController");

const customerRoutes = [
  {
    name: "AllCustomers",
    method: "get",
    path: "/api/customer",
    handler: customerController.get,
  },
];

module.exports = customerRoutes;

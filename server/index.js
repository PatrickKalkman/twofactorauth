/*
 * Primary file for the Workflow Engine
 */

// Dependencies
const log = require("./lib/log");
const server = require("./lib/server");

const app = {};

app.init = function init() {
  log.info("Started api");
  server.start();
};

app.shutdown = function shutdown() {
  server.stop();
  process.exit();
};

process.on("SIGINT", () => {
  log.info("Got SIGINT, gracefully shutting down");
  app.shutdown();
});

process.on("SIGTERM", () => {
  log.info("Got SIGTERM, gracefully shutting down");
  app.shutdown();
});

app.init();

module.exports = app;

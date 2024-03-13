const { route: authRouter } = require("./src/v1/api/rest/auth");

const routeConfig = async (app) => {
  app.use("/api/v1/auth", authRouter);
};

module.exports = routeConfig;

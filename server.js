const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const chalk = require("chalk");
const { default: helmet } = require("helmet");
const express = require("express");
const path = require("path");
const Fingerprint = require("express-fingerprint");
const passport = require("passport");

const routeConfig = require("./route");
const { passportConfig } = require("./src/v1/api/rest/auth");
const { ON_RELEASE, MSG } = require("./constant");
const { SequelizeClient } = require("./src/v1/client");
const { responseNotFound, responseServerError } = require("./response");

const serverConfig = async (app) => {
  /* Server's Middleware */
  app.use(helmet());
  app.use(compression());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.use(
    Fingerprint({
      parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders, Fingerprint.geoip],
    })
  );
  app.use(morgan("combined"));
  app.use(passport.initialize());

  /* Database Connection */
  try {
    const sequelize = SequelizeClient.getInstance();
    const { model: Auth } = require("./src/v1/api/rest/auth");
    await sequelize.sync();
    ON_RELEASE || console.log(chalk.green(MSG.SEQUELIZE_CONNECTION_ESTABLISHED_SUCCESS));
  } catch (error) {
    ON_RELEASE || console.error(chalk.red(`${MSG.SEQUELIZE_CONNECTION_ESTABLISHED_FAILURE}: ${error.message}`));
    process.exit(1);
  }

  /** Passport's Config */
  try {
    await passportConfig(passport);
    ON_RELEASE || console.log(chalk.green(MSG.PASSPORT_ESTABLISHED_SUCCESS));
  } catch (error) {
    ON_RELEASE || console.error(chalk.red(`${MSG.PASSPORT_ESTABLISHED_FAILURE}: ${error.message}`));
    process.exit(2);
  }

  /** Route's Config */
  try {
    await routeConfig(app);
    ON_RELEASE || console.log(chalk.green(MSG.ROUTE_ENDPOINT_ESTABLISHED_SUCCESS));
  } catch (error) {
    ON_RELEASE || console.error(chalk.red(`${MSG.ROUTE_ENDPOINT_ESTABLISHED_FAILURE}: ${error.message}`));
    process.exit(3);
  }

  /** Error Handling */
  app.use((req, res, next) => responseNotFound(res));
  app.use((err, req, res, next) => responseServerError(err, res));
};

module.exports = serverConfig;

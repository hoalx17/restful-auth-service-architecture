const { Sequelize } = require("sequelize");
const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");

const { ON_RELEASE } = require("../../../constant");
const { CODE, MSG } = require("./constant");

class SequelizeClient {
  static getInstance() {
    try {
      if (!this.instance) {
        const { SEQUELIZE_DATABASE_NAME, SEQUELIZE_USERNAME, SEQUELIZE_PASSWORD, SEQUELIZE_HOST_NAME, SEQUELIZE_PORT } = process.env;
        this.instance = new Sequelize(SEQUELIZE_DATABASE_NAME, SEQUELIZE_USERNAME, SEQUELIZE_PASSWORD, {
          host: SEQUELIZE_HOST_NAME,
          dialect: "mysql",
          logging: false,
          port: SEQUELIZE_PORT,
        });
      }
      return this.instance;
    } catch (error) {
      ON_RELEASE || console.log(`Cloudinary Client: ${chalk.red(error.message)}`);
      throwNormalError(error, CODE.GET_SEQUELIZE_CLIENT_FAILURE, MSG.GET_SEQUELIZE_CLIENT_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = SequelizeClient;

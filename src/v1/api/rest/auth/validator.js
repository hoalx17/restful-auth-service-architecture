const chalk = require("chalk");
const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");

const { CODE, MSG } = require("./constant");
const { throwCriticalError, newServerError } = require("../../../error");
const { ON_RELEASE } = require("../../../../../constant");

const createValidator = async (req, schema) => {
  try {
    await schema.validateAsync(req);
  } catch (error) {
    ON_RELEASE || console.log(`Validator: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.VALIDATE_FAILURE, MSG.VALIDATOR_FAILURE, StatusCodes.BAD_REQUEST);
  }
};

const updateValidator = async (req, schema) => {
  try {
    await schema.validateAsync(req);
  } catch (error) {
    ON_RELEASE || console.log(`Validator: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.VALIDATE_FAILURE, MSG.VALIDATOR_FAILURE, StatusCodes.BAD_REQUEST);
  }
};

const truthyValidator = function (errMsg, code, msg, ...args) {
  try {
    const isAllTruthy = Object.values(arguments)
      .slice(3)
      .every((v) => !!v);
    if (!isAllTruthy) {
      const error = newServerError(errMsg);
      ON_RELEASE || console.log(`Validator: ${chalk.red(error.message)}`);
      throwCriticalError(error, code, msg, StatusCodes.BAD_REQUEST);
    }
    return isAllTruthy;
  } catch (error) {
    ON_RELEASE || console.log(`Validator: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.VALIDATE_FAILURE, MSG.VALIDATOR_FAILURE, StatusCodes.BAD_REQUEST);
  }
};

module.exports = {
  createValidator,
  updateValidator,
  truthyValidator,
};

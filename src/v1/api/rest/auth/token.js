const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");

const { CODE, MSG, ERR } = require("./constant");
const { ON_RELEASE } = require("../../../../../constant");
const { throwCriticalError } = require("../../../error");

const getTokenFromHeader = (req, headerName) => {
  try {
    const token = req.get(headerName)?.split(" ")[1] || req.get(headerName);
    if (!token) {
      const error = new Error(ERR.AUTHORIZATION_HEADER_MUST_NOT_EMPTY);
      ON_RELEASE || console.log(`Token: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.AUTHORIZATION_HEADER_MUST_NOT_EMPTY, MSG.AUTHORIZATION_HEADER_MUST_NOT_EMPTY, StatusCodes.BAD_REQUEST);
    }
    return token;
  } catch (error) {
    ON_RELEASE || console.log(`Token: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.GET_TOKEN_FROM_HEADER_FAILURE, MSG.GET_TOKEN_FROM_HEADER_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const signToken = (payload, expiresIn, secretKey) => {
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    ON_RELEASE || console.log(`Token: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.SIGN_TOKEN_FAILURE, MSG.SIGN_TOKEN_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const verifyToken = (token, secretKey) => {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (error) {
    console.log(error);
    ON_RELEASE || console.log(`Token: ${chalk.red(error.message)}`);
    if (error.message === "jwt expired") {
      throwCriticalError(error, CODE.TOKEN_HAS_BEEN_EXPIRED, MSG.TOKEN_HAS_BEEN_EXPIRED, StatusCodes.UNAUTHORIZED);
    } else {
      throwCriticalError(error, CODE.VERIFY_TOKEN_FAILURE, MSG.VERIFY_TOKEN_FAILURE, StatusCodes.UNAUTHORIZED);
    }
  }
};

module.exports = {
  getTokenFromHeader,
  signToken,
  verifyToken,
};

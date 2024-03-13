const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");
const _ = require("lodash");

const { ON_RELEASE } = require("../../../../../constant");
const { throwCriticalError, createCriticalError } = require("../../../error");
const { CODE, MSG, ERR } = require("./constant");
const { core } = require("./service");
const { User, UserVerifySignature } = require("./model");
const { getTokenFromHeader, verifyToken } = require("./token");

const { JWT_ACCESS_TOKEN_SECRET, MAX_ALLOW_SESSION } = process.env;

const requireSignIn = async (req, res, next) => {
  try {
    const accessToken = getTokenFromHeader(req, "Authorization");
    const accessSignature = accessToken.slice(accessToken.lastIndexOf(".") + 1);
    const { username } = verifyToken(accessToken, JWT_ACCESS_TOKEN_SECRET);
    const requestUser = await core.findOneTargetByCondition({ username, activated: true }, User);
    if (_.isEmpty(requestUser)) {
      const error = new Error(ERR.PROFILE_NOT_FOUND);
      ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.PROFILE_NOT_FOUND, MSG.PROFILE_NOT_FOUND, StatusCodes.UNAUTHORIZED);
    } else {
      /** Compare accessSignature with saved accessSignatures */
      const { count, rows: accessSignatures } = await core.findManyTargetByCondition(
        { user_id: requestUser.id },
        { page: 1, size: parseInt(MAX_ALLOW_SESSION) },
        UserVerifySignature
      );
      const isValidSession = accessSignatures.some((v, i, o) => v.toJSON().accessSignature === accessSignature);
      if (!isValidSession) {
        const error = new Error(ERR.SIGNATURE_NOT_MATCH);
        ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
        throwCriticalError(error, CODE.SIGNATURE_NOT_MATCH, MSG.SIGNATURE_NOT_MATCH, StatusCodes.UNAUTHORIZED);
      }
      req.user = { username };
      next();
    }
  } catch (error) {
    console.log(error);
    ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.REQUIRED_SIGN_IN_TO_CONTINUE, MSG.REQUIRED_SIGN_IN_TO_CONTINUE, StatusCodes.UNAUTHORIZED));
  }
};

module.exports = {
  requireSignIn,
};

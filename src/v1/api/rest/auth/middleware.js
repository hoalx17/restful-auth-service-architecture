const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");
const _ = require("lodash");

const { ON_RELEASE } = require("../../../../../constant");
const { throwCriticalError, createCriticalError } = require("../../../error");
const { CODE, MSG, ERR } = require("./constant");
const { core, util } = require("./service");
const { User } = require("./model");
const { getTokenFromHeader, verifyToken } = require("./token");

const { JWT_ACCESS_TOKEN_SECRET } = process.env;

const requireSignIn = async (req, res, next) => {
  try {
    const [accessToken, accessSignature] = getTokenFromHeader(req, "Authorization");
    const { username } = verifyToken(accessToken, JWT_ACCESS_TOKEN_SECRET);
    const requestUser = await core.findOneTargetByCondition({ username, activated: true }, User);
    if (_.isEmpty(requestUser)) {
      const error = new Error(ERR.PROFILE_NOT_FOUND);
      ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.PROFILE_NOT_FOUND, MSG.PROFILE_NOT_FOUND, StatusCodes.UNAUTHORIZED);
    } else {
      const isValidSession = await util.ensureLegalSession(accessSignature, requestUser.id);
      if (!isValidSession) {
        const error = new Error(ERR.SIGNATURE_NOT_MATCH);
        ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
        throwCriticalError(error, CODE.SIGNATURE_NOT_MATCH, MSG.SIGNATURE_NOT_MATCH, StatusCodes.UNAUTHORIZED);
      }
      req.user = { username, id: requestUser.id };
      next();
    }
  } catch (error) {
    ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.REQUIRED_SIGN_IN_TO_CONTINUE, MSG.REQUIRED_SIGN_IN_TO_CONTINUE, StatusCodes.UNAUTHORIZED));
  }
};

module.exports = {
  requireSignIn,
};

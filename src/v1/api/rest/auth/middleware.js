const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");
const _ = require("lodash");

const { ON_RELEASE } = require("../../../../../constant");
const { throwCriticalError, createCriticalError, newServerError } = require("../../../error");
const { CODE, MSG, ERR } = require("./constant");
const { core, util } = require("./service");
const { User, UserVerifySignature } = require("./model");
const { getTokenFromHeader, verifyToken } = require("./token");
const { Op } = require("sequelize");

const { JWT_ACCESS_TOKEN_SECRET } = process.env;

const requireSignIn = async (req, res, next) => {
  try {
    const [accessToken, accessSignature] = getTokenFromHeader(req, "Authorization");
    const [refreshToken, refreshSignature] = getTokenFromHeader(req, "RefreshToken");
    const { username } = verifyToken(accessToken, JWT_ACCESS_TOKEN_SECRET);
    const requestUser = await core.findOneTargetByCondition({ username, activated: true }, User);
    if (_.isEmpty(requestUser)) {
      const error = newServerError(ERR.PROFILE_NOT_FOUND);
      ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.PROFILE_NOT_FOUND, MSG.PROFILE_NOT_FOUND, StatusCodes.UNAUTHORIZED);
    } else {
      const { isLegalSession, sessionId, isCanMakeNewSession } = await util.ensureLegalSession({ accessSignature, id: requestUser.id });
      if (!isLegalSession) {
        const error = newServerError(ERR.ILLEGAL_SESSION);
        ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
        throwCriticalError(error, CODE.ILLEGAL_SESSION, MSG.ILLEGAL_SESSION, StatusCodes.UNAUTHORIZED);
      }
      req.user = {
        refreshSignature,

        username,
        id: requestUser.id,
        hashedPassword: requestUser.password,
        confirmCode: requestUser.confirmCode,
        isPendingDelete: requestUser.isPendingDelete,
        sessionId: sessionId,
        accessSignature,
        isCanMakeNewSession,
      };
      next();
    }
  } catch (error) {
    ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.REQUIRED_SIGN_IN_TO_CONTINUE, MSG.REQUIRED_SIGN_IN_TO_CONTINUE, StatusCodes.UNAUTHORIZED));
  }
};

const requirePendingDelete = async (req, res, next) => {
  try {
    const { isPendingDelete } = req.user;
    if (!isPendingDelete) {
      const error = newServerError(ERR.REQUIRED_PENDING_DELETE_TO_CONTINUE);
      ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.REQUIRED_PENDING_DELETE_TO_CONTINUE, MSG.REQUIRED_PENDING_DELETE_TO_CONTINUE, StatusCodes.FORBIDDEN);
    }
    next();
  } catch (error) {
    ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.REQUIRED_PENDING_DELETE_TO_CONTINUE, MSG.REQUIRED_PENDING_DELETE_TO_CONTINUE, StatusCodes.FORBIDDEN));
  }
};

module.exports = {
  requireSignIn,
  requirePendingDelete,
};

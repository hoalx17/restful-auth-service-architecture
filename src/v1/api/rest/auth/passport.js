const _ = require("lodash");
const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const chalk = require("chalk");
const moment = require("moment");

const { core, util } = require("./service");
const { User } = require("./model");
const { newCriticalError, newServerError } = require("../../../error");
const { CODE, MSG, ERR } = require("./constant");
const { ON_RELEASE } = require("../../../../../constant");
const { getTokenFromHeader } = require("./token");

const { JWT_ACCESS_TOKEN_SECRET } = process.env;

const passportConfig = async (passport) => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
        secretOrKey: JWT_ACCESS_TOKEN_SECRET,
        passReqToCallback: true,
      },
      async (req, jwt_payload, done) => {
        try {
          const [accessToken, accessSignature] = getTokenFromHeader(req, "Authorization");
          const [refreshToken, refreshSignature] = getTokenFromHeader(req, "RefreshToken");
          const { username, exp } = jwt_payload;
          const isTokenExpired = exp < moment().unix();
          if (isTokenExpired) {
            const error = new Error(ERR.TOKEN_HAS_BEEN_EXPIRED);
            ON_RELEASE || console.log(`Passport: ${chalk.red(error.message)}`);
            done(newCriticalError(error, CODE.TOKEN_HAS_BEEN_EXPIRED, MSG.TOKEN_HAS_BEEN_EXPIRED, StatusCodes.UNAUTHORIZED));
          } else {
            const requestUser = await core.findOneTargetByCondition({ username, activated: true }, User);
            if (_.isEmpty(requestUser)) {
              const error = newServerError(ERR.PROFILE_NOT_FOUND);
              ON_RELEASE || console.log(`Passport: ${chalk.red(error.message)}`);
              done(newCriticalError(error, CODE.PROFILE_NOT_FOUND, MSG.PROFILE_NOT_FOUND, StatusCodes.UNAUTHORIZED));
            } else {
              const { isLegalSession, sessionId, isCanMakeNewSession } = await util.ensureLegalSession({ accessSignature, id: requestUser.id });
              if (!isLegalSession) {
                const error = newServerError(ERR.ILLEGAL_SESSION);
                ON_RELEASE || console.log(`Middleware: ${chalk.red(error.message)}`);
                done(newCriticalError(error, CODE.ILLEGAL_SESSION, MSG.ILLEGAL_SESSION, StatusCodes.UNAUTHORIZED));
              }

              const user = {
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
              done(null, user);
            }
          }
        } catch (error) {
          ON_RELEASE || console.log(`Passport: ${chalk.red(error.message)}`);
          done(error);
        }
      }
    )
  );
};

module.exports = passportConfig;

const chalk = require("chalk");
const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const ms = require("ms");
const { Op } = require("sequelize");
const schedule = require("node-schedule");
const Hashids = require("hashids");

const {
  findById,
  findOneByCondition,
  findManyByCondition,
  saveOne,
  saveMany,
  updateById,
  updateManyByCondition,
  removeById,
  removeManyByCondition,
  removeOneByCondition,
} = require("./repository");
const { ON_RELEASE } = require("../../../../../constant");
const { CODE, MSG, ERR } = require("./constant");
const { throwCriticalError, newServerError } = require("../../../error");
const { createValidator, updateValidator, truthyValidator } = require("./validator");
const { CloudinaryUtils } = require("../../../util");
const { User, Role, UserVerifySignature } = require("./model");
const {
  userSchema: { joiUserCreate },
} = require("./schema");
const { signToken } = require("./token");

const {
  CREATION_CHUNK_SIZE,
  CLOUDINARY_DEFAULT_IMAGE_URL,
  JWT_ACCESS_TOKEN_LIFETIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_LIFETIME,
  JWT_REFRESH_TOKEN_SECRET,
  MAX_ALLOW_SESSION,
  SCHEDULE_DELETE_PROFILE_TIME,
  HASHIDS_SALT,
} = process.env;

const hashids = new Hashids(HASHIDS_SALT, 10);

/** Core Service */
const findTargetById = async (id, model, options) => {
  try {
    const target = await findById(id, model, options);
    return target;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.QUERY_TARGET_FAILURE, MSG.QUERY_TARGET_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const findOneTargetByCondition = async (where, model, options) => {
  try {
    const target = await findOneByCondition(where, model, options);
    return target;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.QUERY_TARGET_FAILURE, MSG.QUERY_TARGET_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const findManyTargetByCondition = async (cond, paginate, model, options) => {
  try {
    const { count, rows } = await findManyByCondition(cond, paginate, model, options);
    return { count, rows };
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.QUERY_TARGET_MANY_FAILURE, MSG.QUERY_TARGET_MANY_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const saveOneTarget = async (target, schema, model, options) => {
  try {
    await createValidator(target, schema);
    const saved = await saveOne(target, model, options);
    return saved;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.CREATE_TARGET_FAILURE, MSG.CREATE_TARGET_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const saveManyTarget = async (targets, schema, model, options) => {
  try {
    await Promise.all(targets.map(async (v, i, o) => await createValidator(v, schema)));
    const chunks = _.chunk(targets, CREATION_CHUNK_SIZE);
    const saved = await Promise.all(
      chunks.map(async (v, i, o) => {
        const saved = await saveMany(v, model, options);
        return saved;
      })
    );
    return _.flatten(saved);
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.CREATE_TARGET_MANY_FAILURE, MSG.CREATE_TARGET_MANY_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateTargetById = async (id, target, schema, model, options) => {
  try {
    await updateValidator(target, schema);
    const old = await updateById(id, target, model, options);
    return old;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.UPDATE_TARGET_FAILURE, MSG.UPDATE_TARGET_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateTargetManyByCondition = async (where, target, schema, model, options) => {
  try {
    await updateValidator(target, schema);
    const old = await updateManyByCondition(where, target, model, options);
    return old;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.UPDATE_TARGET_MANY_FAILURE, MSG.UPDATE_TARGET_MANY_SUCCESS, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const removeTargetById = async (id, model, options) => {
  try {
    const old = await removeById(id, model, options);
    return old;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.DELETE_TARGET_FAILURE, MSG.DELETE_TARGET_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const removeTargetManyByCondition = async (where, model, options) => {
  try {
    const old = await removeManyByCondition(where, model, options);
    return old;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.DELETE_TARGET_MANY_FAILURE, MSG.DELETE_TARGET_MANY_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

/** Util Service */
const ensureLegalSession = async (payload) => {
  try {
    const { id, accessSignature } = payload;
    const { rows: accessSignatures } = await findManyTargetByCondition(
      {
        user_id: id,
        access_signature_expired_at: {
          [Op.gt]: new Date(),
        },
      },
      { page: 1, size: parseInt(MAX_ALLOW_SESSION) },
      UserVerifySignature
    );
    const session = accessSignatures.find((v, i, o) => v.toJSON().accessSignature === accessSignature);
    if (!session) {
      const error = newServerError(ERR.ILLEGAL_SESSION);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.ILLEGAL_SESSION, MSG.ILLEGAL_SESSION, StatusCodes.FORBIDDEN);
    }
    const isCanMakeNewSession = accessSignatures.length < parseInt(MAX_ALLOW_SESSION);
    return { isLegalSession: !!session, sessionId: session.id, isCanMakeNewSession };
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.ENSURE_LEGAL_SESSION_FAILURE, MSG.ENSURE_LEGAL_SESSION_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const ensureCanMakeNewSession = async (payload) => {
  try {
    const { id } = payload;
    const { count, rows: accessSignatures } = await findManyTargetByCondition(
      {
        user_id: id,
        access_signature_expired_at: {
          [Op.gt]: new Date(),
        },
      },
      { page: 1, size: parseInt(MAX_ALLOW_SESSION) },
      UserVerifySignature
    );
    return accessSignatures.length < parseInt(MAX_ALLOW_SESSION);
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.ENSURE_CAN_MAKE_SESSION_FAILURE, MSG.ENSURE_CAN_MAKE_SESSION_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const ensureNotCurrentSession = async (sessionId, payload) => {
  try {
    const { sessionId: currentSessionId } = payload;
    const targetSessionId = hashids.decode(sessionId)[0] || 0;
    return targetSessionId !== currentSessionId;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.ENSURE_NOT_CURRENT_SESSION_FAILURE, MSG.ENSURE_NOT_CURRENT_SESSION_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

/** Auth Service */
// TODO: Custom Sequelize error message
const signUp = async (user, roleId, imageBuffer) => {
  try {
    // TODO: Should validate request before uploading
    /** Upload image to Cloudinary, if imageBuffer not provided, use default image url */
    if (imageBuffer) {
      const uploadImage = await CloudinaryUtils.uploadSingleImage(imageBuffer);
      user.imageUrl = uploadImage.secure_url;
    } else {
      user.imageUrl = CLOUDINARY_DEFAULT_IMAGE_URL;
    }
    /** Save user with role, if role id not exists, save as default role (user) */
    const role = await findTargetById(roleId, Role);
    const saved = await saveOneTarget(user, joiUserCreate, User);
    await role.addUsers(saved);
    // TODO: Send activation request email
    return saved;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.SIGNUP_FAILURE, MSG.SIGNUP_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const activate = async (username, confirmCode) => {
  try {
    truthyValidator(
      ERR.USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY,
      CODE.USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY,
      MSG.USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY,
      username,
      confirmCode
    );
    const requestUser = await findOneByCondition({ username, activated: false }, User);
    if (_.isEmpty(requestUser)) {
      const error = newServerError(ERR.PROFILE_NOT_FOUND);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.PROFILE_NOT_FOUND, MSG.PROFILE_NOT_FOUND, StatusCodes.BAD_REQUEST);
    } else if (confirmCode !== requestUser.confirmCode) {
      const error = newServerError(ERR.CONFIRM_CODE_NOT_MATCH);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.CONFIRM_CODE_NOT_MATCH, MSG.CONFIRM_CODE_NOT_MATCH, StatusCodes.BAD_REQUEST);
    } else {
      const old = await updateById(requestUser.id, { activated: true }, User);
      return old;
    }
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.ACTIVATE_FAILURE, MSG.ACTIVATE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const signIn = async (username, password) => {
  try {
    truthyValidator(
      ERR.USERNAME_OR_PASSWORD_MUST_NOT_EMPTY,
      CODE.USERNAME_OR_PASSWORD_MUST_NOT_EMPTY,
      MSG.USERNAME_OR_PASSWORD_MUST_NOT_EMPTY,
      username,
      password
    );
    const requestUser = await findOneByCondition({ username, activated: true }, User);
    const isValidLogin = await bcrypt.compare(password, requestUser.password || "");
    if (_.isEmpty(requestUser)) {
      const error = newServerError(ERR.PROFILE_NOT_FOUND);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.PROFILE_NOT_FOUND, MSG.PROFILE_NOT_FOUND, StatusCodes.BAD_REQUEST);
    } else if (!isValidLogin) {
      const error = newServerError(ERR.USERNAME_OR_PASSWORD_NOT_MATCH);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.USERNAME_OR_PASSWORD_NOT_MATCH, MSG.USERNAME_OR_PASSWORD_NOT_MATCH, StatusCodes.BAD_REQUEST);
    } else {
      const isCanMakeNewSession = await ensureCanMakeNewSession({ id: requestUser.id });
      if (!isCanMakeNewSession) {
        const error = newServerError(ERR.MAX_SESSION_REACH);
        ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
        throwCriticalError(error, CODE.MAX_SESSION_REACH, MSG.MAX_SESSION_REACH, StatusCodes.BAD_REQUEST);
      } else {
        const payload = { username: requestUser.username };
        const [accessToken, accessSignature] = signToken(payload, JWT_ACCESS_TOKEN_LIFETIME, JWT_ACCESS_TOKEN_SECRET);
        const [refreshToken, refreshSignature] = signToken(payload, JWT_REFRESH_TOKEN_LIFETIME, JWT_REFRESH_TOKEN_SECRET);
        const userVerifySignature = await saveOne(
          {
            accessSignature,
            accessSignatureExpiredAt: new Date(Date.now() + ms(JWT_ACCESS_TOKEN_LIFETIME)),
            refreshSignature,
            refreshSignatureExpiredAt: new Date(Date.now() + ms(JWT_REFRESH_TOKEN_LIFETIME)),
          },
          UserVerifySignature
        );
        await userVerifySignature.setUser(requestUser);
        return { accessToken, refreshToken };
      }
    }
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.SIGN_IN_FAILURE, MSG.SIGN_IN_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const me = async (payload) => {
  try {
    const { username } = payload;
    const requestUser = await findOneByCondition({ username, activated: true }, User, {
      include: {
        model: Role,
        as: "roles",
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    });
    return requestUser;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.GET_PROFILE_INFO_FAILURE, MSG.GET_PROFILE_INFO_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getSessions = async (payload) => {
  try {
    const { id, accessSignature } = payload;
    const { count, rows } = await findManyTargetByCondition(
      {
        user_id: id,
        access_signature_expired_at: {
          [Op.gt]: new Date(),
        },
      },
      { page: 1, size: parseInt(MAX_ALLOW_SESSION) },
      UserVerifySignature
    );
    const sessions = rows.map((v, i, o) => ({
      id: hashids.encode(v.id),
      current: v.accessSignature === accessSignature,
      createdAt: v.created_at,
      expiredAt: v.accessSignatureExpiredAt,
      refreshExpiredAt: v.refreshSignatureExpiredAt,
    }));
    return { count, sessions };
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.GET_ALL_SESSION_FAILURE, MSG.GET_ALL_SESSION_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const deactivate = async (password, payload) => {
  try {
    truthyValidator(
      ERR.USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY,
      CODE.USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY,
      MSG.USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY,
      password
    );
    const { id, hashedPassword } = payload;
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatch) {
      const error = newServerError(ERR.USERNAME_OR_PASSWORD_NOT_MATCH);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.USERNAME_OR_PASSWORD_NOT_MATCH, MSG.USERNAME_OR_PASSWORD_NOT_MATCH, StatusCodes.BAD_REQUEST);
    } else {
      await removeManyByCondition({ user_id: id }, UserVerifySignature);
      const old = await updateById(id, { activated: false }, User);
      return old;
    }
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.DEACTIVATE_FAILURE, MSG.DEACTIVATE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const signOut = async (payload) => {
  try {
    const { id, accessSignature } = payload;
    const old = await removeManyByCondition({ user_id: id, access_signature: accessSignature }, UserVerifySignature);
    return old;
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.SIGN_OUT_FAILURE, MSG.SIGN_OUT_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const remove = async (password, payload) => {
  try {
    truthyValidator(ERR.USERNAME_OR_PASSWORD_MUST_NOT_EMPTY, CODE.USERNAME_OR_PASSWORD_MUST_NOT_EMPTY, MSG.USERNAME_OR_PASSWORD_MUST_NOT_EMPTY, password);
    const { id, hashedPassword, username } = payload;
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatch) {
      const error = newServerError(ERR.USERNAME_OR_PASSWORD_NOT_MATCH);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.USERNAME_OR_PASSWORD_NOT_MATCH, MSG.USERNAME_OR_PASSWORD_NOT_MATCH, StatusCodes.BAD_REQUEST);
    } else {
      const old = await updateById(id, { isPendingDelete: true }, User);
      const removeOn = new Date(Date.now() + ms(SCHEDULE_DELETE_PROFILE_TIME));
      const scheduleJobName = `${username}ProfileDeleteTask`;
      // TODO: Move schedule task function to another
      schedule.scheduleJob(scheduleJobName, removeOn, async () => {
        await removeManyByCondition({ user_id: id }, UserVerifySignature);
        await removeById(id, User);
      });
      return { old, removeOn };
    }
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.DELETE_PROFILE_FAILURE, MSG.DELETE_PROFILE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const cancelRemove = async (password, payload) => {
  try {
    const { id, hashedPassword, username } = payload;
    truthyValidator(ERR.USERNAME_OR_PASSWORD_MUST_NOT_EMPTY, CODE.USERNAME_OR_PASSWORD_MUST_NOT_EMPTY, MSG.USERNAME_OR_PASSWORD_MUST_NOT_EMPTY, password);
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatch) {
      const error = newServerError(ERR.USERNAME_OR_PASSWORD_NOT_MATCH);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.USERNAME_OR_PASSWORD_NOT_MATCH, MSG.USERNAME_OR_PASSWORD_NOT_MATCH, StatusCodes.BAD_REQUEST);
    } else {
      const old = await updateById(id, { isPendingDelete: false }, User);
      const scheduleJobName = `${username}ProfileDeleteTask`;
      const scheduleJob = schedule.scheduledJobs[scheduleJobName];
      scheduleJob.cancel();
      return old;
    }
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.CANCEL_DELETE_PROFILE_FAILURE, MSG.CANCEL_DELETE_PROFILE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const terminateSessions = async (payload) => {
  try {
    const { accessSignature, id } = payload;
    const terminateSession = await removeManyByCondition(
      {
        user_id: id,
        access_signature: {
          [Op.ne]: accessSignature,
        },
      },
      UserVerifySignature
    );
    const sessions = terminateSession.map((v, i, o) => ({ id: hashids.encode(v.id) }));
    return { count: sessions.length, sessions };
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.TERMINATE_SESSIONS_FAILURES, MSG.TERMINATE_SESSIONS_FAILURES, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const terminateAllSessions = async (payload) => {
  try {
    const { id } = payload;
    const terminateSession = await removeManyByCondition(
      {
        user_id: id,
      },
      UserVerifySignature
    );
    const sessions = terminateSession.map((v, i, o) => ({ id: hashids.encode(v.id) }));
    return { count: sessions.length, sessions };
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.TERMINATE_ALL_SESSIONS_FAILURE, MSG.TERMINATE_ALL_SESSIONS_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const terminateSession = async (sessionId, payload) => {
  try {
    const { id } = payload;
    const targetSessionId = hashids.decode(sessionId)[0] || 0;
    const isNotCurrentSession = await ensureNotCurrentSession(sessionId, payload);
    console.log(isNotCurrentSession);
    if (!isNotCurrentSession) {
      const error = newServerError(ERR.CANNOT_TERMINAL_CURRENT_SESSION);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.CANNOT_TERMINAL_CURRENT_SESSION, MSG.CANNOT_TERMINAL_CURRENT_SESSION, StatusCodes.FORBIDDEN);
    } else {
      const session = await removeOneByCondition({ user_id: id, id: targetSessionId }, UserVerifySignature);
      return { id: hashids.encode(session.id) };
    }
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.TERMINATE_SESSION_FAILURES, MSG.TERMINATE_SESSION_FAILURES, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const resetPassword = async (username, confirmCode, password, payload) => {
  try {
    truthyValidator(
      ERR.USERNAME_PASSWORD_OR_CONFIRM_CODE_MUST_NOT_EMPTY,
      CODE.USERNAME_PASSWORD_OR_CONFIRM_CODE_MUST_NOT_EMPTY,
      MSG.USERNAME_PASSWORD_OR_CONFIRM_CODE_MUST_NOT_EMPTY,
      username,
      confirmCode,
      password
    );
    const requestUser = await findOneByCondition({ username, activated: true }, User);
    if (_.isEmpty(requestUser)) {
      const error = newServerError(ERR.PROFILE_NOT_FOUND);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.PROFILE_NOT_FOUND, MSG.PROFILE_NOT_FOUND, StatusCodes.BAD_REQUEST);
    } else if (confirmCode !== requestUser.confirmCode) {
      const error = newServerError(ERR.CONFIRM_CODE_NOT_MATCH);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.CONFIRM_CODE_NOT_MATCH, MSG.CONFIRM_CODE_NOT_MATCH, StatusCodes.BAD_REQUEST);
    } else {
      const old = await updateById(requestUser.id, { password }, User);
      await terminateAllSessions({ id: requestUser.id });
      return old;
    }
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.RESET_PASSWORD_FAILURE, MSG.RESET_PASSWORD_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const refresh = async (payload) => {
  try {
    const { id, username, accessSignature, refreshSignature } = payload;
    truthyValidator(ERR.REFRESH_TOKEN_MUST_NOT_EMPTY, CODE.REFRESH_TOKEN_MUST_NOT_EMPTY, MSG.REFRESH_TOKEN_MUST_NOT_EMPTY, refreshSignature);
    const signature = await findOneByCondition({ access_signature: accessSignature, user_id: id }, UserVerifySignature);
    if (signature.refreshSignature !== refreshSignature) {
      const error = newServerError(ERR.REFRESH_TOKEN_NOT_MATCH);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.REFRESH_TOKEN_NOT_MATCH, MSG.REFRESH_TOKEN_NOT_MATCH, StatusCodes.BAD_REQUEST);
    } else {
      const payload = { username };
      const [newAccessToken, newAccessSignature] = signToken(payload, JWT_ACCESS_TOKEN_LIFETIME, JWT_ACCESS_TOKEN_SECRET);
      const [newRefreshToken, newRefreshSignature] = signToken(payload, JWT_REFRESH_TOKEN_LIFETIME, JWT_REFRESH_TOKEN_SECRET);
      signature.update({
        accessSignature: newAccessSignature,
        accessSignatureExpiredAt: new Date(Date.now() + ms(JWT_ACCESS_TOKEN_LIFETIME)),
        refreshSignature: newRefreshSignature,
        refreshSignatureExpiredAt: new Date(Date.now() + ms(JWT_REFRESH_TOKEN_LIFETIME)),
      });
      return { newAccessToken, newRefreshToken };
    }
  } catch (error) {
    ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.REFRESH_SESSION_FAILURE, MSG.REFRESH_SESSION_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  core: {
    findTargetById,
    findOneTargetByCondition,
    findManyTargetByCondition,
    saveOneTarget,
    saveManyTarget,
    updateTargetById,
    updateTargetManyByCondition,
    removeTargetById,
    removeTargetManyByCondition,
  },
  util: {
    ensureLegalSession,
    ensureNotCurrentSession,
  },
  auth: {
    signUp,
    activate,
    signIn,
    me,
    getSessions,
    deactivate,
    signOut,
    remove,
    cancelRemove,
    terminateSessions,
    terminateSession,
    resetPassword,
    refresh,
  },
};

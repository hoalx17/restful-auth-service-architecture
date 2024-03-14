const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");
const Hashids = require("hashids");

const { core, auth } = require("./service");
const { ON_RELEASE } = require("../../../../../constant");
const { CODE, MSG } = require("./constant");
const { requestTransform, roleTransform, userTransform, responseTransform } = require("./transform");
const { Role } = require("./model");
const {
  roleSchema: { joiRoleCreate, joiRoleUpdate },
} = require("./schema");
const { createCriticalError } = require("../../../error");
const {
  responseFindById,
  responseFindManyByCondition,
  responseSave,
  responseUpdate,
  responseRemove,
  responseSignIn,
  responseFindOrigin,
  responseFindManyOrigin,
} = require("./response");

const { HASHIDS_SALT } = process.env;

const hashids = new Hashids(HASHIDS_SALT, 10);

/** Dev Controller */
const devController = async (req, res, next) => {
  try {
    console.log(chalk.red("Dev Controller..."));
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
  }
};

/** Role Controller */
const findRoleByIdController = async (req, res, next) => {
  try {
    req = requestTransform(req);
    const { id } = req.params;
    const target = await core.findTargetById(id, Role);
    responseFindById(res, target);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.QUERY_TARGET_FAILURE, MSG.QUERY_TARGET_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const findManyRoleByConditionController = async (req, res, next) => {
  try {
    req = requestTransform(req);
    const { page, size, cursor, name } = req.query;
    const cond = { name };
    const paginate = { page: parseInt(page), size: parseInt(size), cursor };
    Object.keys(cond).forEach((v, i, o) => cond[v] || delete cond[v]);
    const { count, rows } = await core.findManyTargetByCondition(cond, paginate, Role);
    responseFindManyByCondition(res, count, rows, paginate, cursor);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.QUERY_TARGET_MANY_FAILURE, MSG.QUERY_TARGET_MANY_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const saveRoleController = async (req, res, next) => {
  try {
    let saved;
    if (!req.body?.length) {
      const target = roleTransform.singleCreationRoleTransform(req);
      saved = await core.saveOneTarget(target, joiRoleCreate, Role);
    } else {
      const targets = roleTransform.multiCreationRoleTransform(req);
      saved = await core.saveManyTarget(targets, joiRoleCreate, Role);
    }
    responseSave(res, saved);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.CREATE_TARGET_FAILURE, MSG.CREATE_TARGET_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const updateRoleByIdController = async (req, res, next) => {
  try {
    req = requestTransform(req);
    const { id } = req.params;
    const target = roleTransform.singleUpdateRoleTransform(req);
    const old = await core.updateTargetById(id, target, joiRoleUpdate, Role);
    responseUpdate(res, old);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.UPDATE_TARGET_FAILURE, MSG.UPDATE_TARGET_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const removeRoleByIdController = async (req, res, next) => {
  try {
    req = requestTransform(req);
    const { id } = req.params;
    const old = await core.removeTargetById(id, Role);
    responseRemove(res, old);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.DELETE_TARGET_FAILURE, MSG.DELETE_TARGET_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

/** Auth Controller */
const signUpController = async (req, res, next) => {
  try {
    const target = await userTransform.singleCreationUserTransform(req);
    const roleId = req.body?.roleId || req.body[0]?.roleId;
    const targetRoleId = hashids.decode(roleId)[0] || 1;
    const imageBuffer = req.file?.buffer;
    const saved = await auth.signUp(target, targetRoleId, imageBuffer);
    responseSave(res, saved, MSG.SIGNUP_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.SIGNUP_FAILURE, MSG.SIGNUP_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const activateController = async (req, res, next) => {
  try {
    const { username, confirmCode } = req.query;
    const old = await auth.activate(username, confirmCode);
    responseUpdate(res, old, MSG.ACTIVATE_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.ACTIVATE_FAILURE, MSG.ACTIVATE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const signInController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { accessToken, refreshToken } = await auth.signIn(username, password);
    responseSignIn(res, { accessToken, refreshToken });
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.SIGN_IN_FAILURE, MSG.SIGN_IN_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const meController = async (req, res, next) => {
  try {
    const { username } = req.user;
    const payload = { username };
    const requestUser = await auth.me(payload);
    const user = responseTransform(requestUser.toJSON());
    responseFindOrigin(res, user, MSG.GET_PROFILE_INFO_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.GET_PROFILE_INFO_FAILURE, MSG.GET_PROFILE_INFO_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const getSessionsController = async (req, res, next) => {
  try {
    const { id, accessSignature } = req.user;
    const payload = { id, accessSignature };
    const { count, sessions } = await auth.getSessions(payload);
    responseFindManyOrigin(res, count, sessions, {}, undefined, MSG.GET_ALL_SESSION_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.GET_ALL_SESSION_FAILURE, MSG.GET_ALL_SESSION_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const deactivateController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { id, hashedPassword } = req.user;
    const payload = { id, hashedPassword };
    const old = await auth.deactivate(password, payload);
    responseUpdate(res, old, MSG.DEACTIVATE_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.DEACTIVATE_FAILURE, MSG.DEACTIVATE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const signOutController = async (req, res, next) => {
  try {
    const { id, accessSignature } = req.user;
    const payload = { id, accessSignature };
    const old = await auth.signOut(payload);
    responseRemove(res, old, MSG.SIGN_OUT_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.SIGN_OUT_FAILURE, MSG.SIGN_OUT_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const removeController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { id, username, hashedPassword } = req.user;
    const payload = { id, hashedPassword, username };
    const { old, removeOn } = await auth.remove(username, password, payload);
    responseRemove(res, { username: old.username, removeOn }, MSG.DELETE_PROFILE_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.DELETE_PROFILE_FAILURE, MSG.DELETE_PROFILE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const cancelRemoveController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { id, username, hashedPassword } = req.user;
    const payload = { id, hashedPassword, username };
    const old = await auth.cancelRemove(password, payload);
    responseRemove(res, old, MSG.CANCEL_DELETE_PROFILE_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.DELETE_PROFILE_FAILURE, MSG.DELETE_PROFILE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const terminateSessionsController = async (req, res, next) => {
  try {
    const { accessSignature, id } = req.user;
    const payload = { accessSignature, id };
    const { count, sessions } = await auth.terminateSessions(payload);
    responseRemove(res, sessions, MSG.TERMINATE_SESSIONS_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.TERMINATE_SESSIONS_FAILURES, MSG.TERMINATE_SESSIONS_FAILURES, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const terminateSessionController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, accessSignature } = req.user;
    const payload = { id: userId, accessSignature };
    const session = await auth.terminateSession(id, payload);
    responseRemove(res, session, MSG.TERMINATE_SESSION_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.TERMINATE_SESSIONS_FAILURES, MSG.TERMINATE_SESSIONS_FAILURES, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    const { username, confirmCode } = req.query;
    const { password } = req.body;
    const old = await auth.resetPassword(username, confirmCode, password);
    responseUpdate(res, old, MSG.RESET_PASSWORD_SUCCESS);
  } catch (error) {
    ON_RELEASE || console.log(`Controller: ${chalk.red(error.message)}`);
    next(createCriticalError(error, CODE.RESET_PASSWORD_FAILURE, MSG.RESET_PASSWORD_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  devController,
  roleController: {
    findRoleByIdController,
    findManyRoleByConditionController,
    saveRoleController,
    updateRoleByIdController,
    removeRoleByIdController,
  },
  authController: {
    signUpController,
    activateController,
    signInController,
    meController,
    getSessionsController,
    deactivateController,
    signOutController,
    removeController,
    cancelRemoveController,
    terminateSessionsController,
    terminateSessionController,
    resetPasswordController,
  },
};

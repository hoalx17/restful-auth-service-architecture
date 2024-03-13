const chalk = require("chalk");
const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");

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
} = require("./repository");
const { ON_RELEASE } = require("../../../../../constant");
const { CODE, MSG, ERR } = require("./constant");
const { throwCriticalError } = require("../../../error");
const { createValidator, updateValidator, truthyValidator } = require("./validator");
const { CloudinaryUtils } = require("../../../util");
const { User, Role } = require("./model");
const {
  userSchema: { joiUserCreate, joiUserUpdate },
} = require("./schema");

const { CREATION_CHUNK_SIZE, CLOUDINARY_DEFAULT_IMAGE_URL } = process.env;

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
    /** Find not activate user by username and compare with confirmCode */
    const requestUser = await findOneByCondition({ username, activated: false }, User);
    /** Profile has been activated before or profile not found */
    if (_.isEmpty(requestUser)) {
      const error = new Error(ERR.PROFILE_NOT_FOUND);
      ON_RELEASE || console.log(`Service: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.PROFILE_NOT_FOUND, MSG.PROFILE_NOT_FOUND, StatusCodes.BAD_REQUEST);
    } else if (confirmCode !== requestUser.confirmCode) {
      /** Confirm Code not match */
      const error = new Error(ERR.CONFIRM_CODE_NOT_MATCH);
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
  auth: {
    signUp,
    activate,
  },
};

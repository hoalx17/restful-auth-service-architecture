const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");
const Hashids = require("hashids");

const { core } = require("./service");
const { ON_RELEASE } = require("../../../../../constant");
const { CODE, MSG } = require("./constant");
const { requestTransform, roleTransform } = require("./transform");
const { Role } = require("./model");
const {
  roleSchema: { joiRoleCreate, joiRoleUpdate },
} = require("./schema");
const { createCriticalError } = require("../../../error");
const { responseFindById, responseFindManyByCondition, responseSave, responseUpdate, responseRemove } = require("./response");

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

module.exports = {
  devController,
  roleController: {
    findRoleByIdController,
    findManyRoleByConditionController,
    saveRoleController,
    updateRoleByIdController,
    removeRoleByIdController,
  },
  authController: {},
};

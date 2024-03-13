const chalk = require("chalk");
const Hashids = require("hashids");
const { Op } = require("sequelize");
const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");

const { throwCriticalError } = require("../../../error");
const { CODE, MSG, ERR } = require("./constant");
const { ON_RELEASE } = require("../../../../../constant");

const { HASHIDS_SALT, PAGINATE_BOUNDARY } = process.env;

const hashids = new Hashids(HASHIDS_SALT, 10);

const findById = async (id, model, options) => {
  try {
    const target = await model.findByPk(id, options);
    return target || {};
  } catch (error) {
    ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.QUERY_FAILURE, MSG.QUERY_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const findOneByCondition = async (where, model, options) => {
  try {
    const target = await model.findOne({ ...options, where });
    return target || {};
  } catch (error) {
    ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.QUERY_FAILURE, MSG.QUERY_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const findManyByCondition = async (cond, paginate, model, options) => {
  try {
    const { page, size, cursor } = paginate;
    const offset = (page - 1) * size;

    if (page <= PAGINATE_BOUNDARY) {
      const { count, rows } = await model.findAndCountAll({ ...options, where: cond, offset: offset, limit: size });
      return { count, rows };
    } else {
      const originId = hashids.decode(cursor)[0];
      const { count, rows } = await model.findAndCountAll({
        ...options,
        where: {
          id: {
            [Op.gt]: originId,
          },
        },
        limit: size,
      });
      return { count, rows };
    }
  } catch (error) {
    ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.QUERY_MANY_FAILURE, MSG.QUERY_MANY_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const saveOne = async (target, model, options) => {
  try {
    const saved = await model.create(target, options);
    return saved;
  } catch (error) {
    ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.CREATE_FAILURE, MSG.CREATE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const saveMany = async (targets, model, options) => {
  try {
    const saved = await model.bulkCreate(targets, options);
    return saved.length ? saved : [];
  } catch (error) {
    ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.CREATE_MANY_FAILURE, MSG.CREATE_MANY_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateById = async (id, target, model, options) => {
  try {
    const old = await findById(id, model);
    if (_.isEmpty(old)) {
      const error = new Error(ERR.NOT_MODIFIED);
      ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.NOT_MODIFY, MSG.NOT_MODIFY, StatusCodes.NOT_MODIFIED);
    }
    await model.update(target, {
      ...options,
      where: { id },
      individualHooks: true,
    });
    return old;
  } catch (error) {
    ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.UPDATE_FAILURE, MSG.UPDATE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateManyByCondition = async (where, target, model, options) => {
  try {
    const old = await model.findAll({
      ...options,
      where,
    });
    if (_.isEmpty(old)) {
      const error = new Error(ERR.NOT_MODIFIED);
      ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.NOT_MODIFY, MSG.NOT_MODIFY, StatusCodes.NOT_MODIFIED);
    }
    await model.update(target, {
      ...options,
      where,
      individualHooks: true,
    });
    return old;
  } catch (error) {
    ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.UPDATE_MANY_FAILURE, MSG.UPDATE_MANY_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const removeById = async (id, model, options) => {
  try {
    const old = await findById(id, model);
    if (_.isEmpty(old)) {
      const error = new Error(ERR.NOT_MODIFIED);
      ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.NOT_MODIFY, MSG.NOT_MODIFY, StatusCodes.NOT_MODIFIED);
    }
    await model.destroy({
      ...options,
      where: { id },
    });
    return old;
  } catch (error) {
    ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.DELETE_FAILURE, MSG.DELETE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const removeManyByCondition = async (where, model, options) => {
  try {
    const old = await model.findAll({
      ...options,
      where,
    });
    if (_.isEmpty(old)) {
      const error = new Error(ERR.NOT_MODIFIED);
      ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
      throwCriticalError(error, CODE.NOT_MODIFY, MSG.NOT_MODIFY, StatusCodes.NOT_MODIFIED);
    }
    await model.destroy({
      ...options,
      where,
    });
    return old;
  } catch (error) {
    ON_RELEASE || console.log(`Repository: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.DELETE_MANY_FAILURE, MSG.DELETE_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  findById,
  findOneByCondition,
  findManyByCondition,
  saveOne,
  saveMany,
  updateById,
  updateManyByCondition,
  removeById,
  removeManyByCondition,
};

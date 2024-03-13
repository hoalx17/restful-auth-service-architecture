const Hashids = require("hashids");
const chalk = require("chalk");
const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

const { CODE, MSG } = require("./constant");
const { throwCriticalError } = require("../../../error");
const { ON_RELEASE } = require("../../../../../constant");

const { HASHIDS_SALT, CLOUDINARY_DEFAULT_IMAGE_URL } = process.env;

const hashids = new Hashids(HASHIDS_SALT, 10);

const requestTransform = (req) => {
  try {
    /** findOne */
    if (req.params?.id) {
      req.params.id = hashids.decode(req.params?.id)[0] || 0;
    }
    /** findMany */
    if (!req.query?.page || !req.query?.size || req.query?.size > 25 || req.query?.size < 5) {
      req.query.page = req.query?.page || 1;
      req.query.size = req.query?.size < 5 || !req.query?.size ? 5 : req.query?.size;
      req.query.size = req.query?.size > 25 || !req.query?.size ? 25 : req.query?.size;
    }
    if (req.query?.page > 25 && !req.query?.cursor) {
      req.query.size = req.query?.size < 5 || !req.query?.size ? 5 : req.query?.size;
      req.query.size = req.query?.size > 25 || !req.query?.size ? 25 : req.query?.size;
      const offset = (req.query?.page - 1) * req.query?.size;
      req.query.cursor = hashids.encode(offset);
    }
    return req;
  } catch (error) {
    ON_RELEASE || console.log(`Transform: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.REQUEST_TRANSFORM_FAILURE, MSG.REQUEST_TRANSFORM_FAILURE, StatusCodes.BAD_REQUEST);
  }
};

const responseTransform = (res) => {
  try {
    if (_.isEmpty(res)) {
      return res;
    }
    const { id, password, fingerprint, confirmCode, created_at, updated_at, deleted_at, roles, ...response } = res;
    response.id = hashids.encode(id);
    response.roles = roles.map((v, i, o) => ({
      ...v,
      id: hashids.encode(v.id),
    }));
    return response;
  } catch (error) {
    ON_RELEASE || console.log(`Transform: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.RESPONSE_TRANSFORM_FAILURE, MSG.RESPONSE_TRANSFORM_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const responseTransformMany = (res) => {
  try {
    if (_.isEmpty(res)) {
      return res;
    }
    const response = res.map((v, i, o) => {
      const { id, password, fingerprint, confirmCode, created_at, updated_at, deleted_at, ...response } = v;
      response.id = hashids.encode(id);
      return response;
    });
    return response;
  } catch (error) {
    ON_RELEASE || console.log(`Transform: ${chalk.red(error.message)}`);
    throwCriticalError(error, CODE.RESPONSE_TRANSFORM_FAILURE, MSG.RESPONSE_TRANSFORM_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const singleCreationRoleTransform = (req) => {
  const { name } = req.body;
  return { name };
};

const multiCreationRoleTransform = (req) => {
  return req.body;
};

const singleUpdateRoleTransform = (req) => {
  const { name } = req.body;
  return { name };
};

const singleCreationUserTransform = async (req) => {
  const { username, password, firstName, lastName, birthDay, gender, email, tel } = req.body;
  return {
    username,
    password,
    firstName,
    lastName,
    birthDay,
    gender,
    email,
    tel,
    fingerprint: req.fingerprint?.hash,
    imageUrl: CLOUDINARY_DEFAULT_IMAGE_URL,
    confirmCode: uuidv4(),
  };
};

const multiCreationUserTransform = (req) => {
  const targets = req.body?.map((v, i, o) => {
    const { roleId, ...rest } = v;
    return { ...rest, fingerprint: req.fingerprint?.hash, imageUrl: CLOUDINARY_DEFAULT_IMAGE_URL };
  });
  return targets;
};

const singleUpdateUserTransform = (req) => {
  const { password, birthDay, gender, imageUrl, activated } = req.body;
  return { password, birthDay, gender, imageUrl, activated, confirmCode: uuidv4() };
};

module.exports = {
  requestTransform,
  responseTransform,
  responseTransformMany,
  roleTransform: {
    singleCreationRoleTransform,
    multiCreationRoleTransform,
    singleUpdateRoleTransform,
  },
  userTransform: {
    singleCreationUserTransform,
    multiCreationUserTransform,
    singleUpdateUserTransform,
  },
};

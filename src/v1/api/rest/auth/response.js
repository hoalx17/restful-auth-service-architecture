const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const _ = require("lodash");
const Hashids = require("hashids");

const { MSG } = require("./constant");
const { responseTransform, responseTransformMany } = require("./transform");
const { Response } = require("../../../../../response");

const { PAGINATE_BOUNDARY, HASHIDS_SALT } = process.env;

const hashids = new Hashids(HASHIDS_SALT, 10);

const responseFindById = (res, target, msg) => {
  const statusCode = !_.isEmpty(target) ? StatusCodes.OK : StatusCodes.NO_CONTENT;
  const metadata = !_.isEmpty(target)
    ? { statusCode: StatusCodes.OK, statusText: ReasonPhrases.OK }
    : { statusCode: StatusCodes.NO_CONTENT, statusText: ReasonPhrases.NO_CONTENT };
  const message = msg || !_.isEmpty(target) ? MSG.QUERY_TARGET_SUCCESS : MSG.QUERY_TARGET_NO_CONTENT;
  const error = { code: null, missing: false };
  const payload = _.isEmpty(target) || responseTransform(target.toJSON());
  const pagination = null;
  const hateos = null;
  res.status(statusCode).json(new Response(metadata, error, message, payload, pagination, hateos));
};

const responseFindManyByCondition = (res, count, rows, paginate, cursor, msg) => {
  const statusCode = count ? StatusCodes.OK : StatusCodes.NO_CONTENT;
  const metadata = count
    ? { statusCode: StatusCodes.OK, statusText: ReasonPhrases.OK }
    : { statusCode: StatusCodes.NO_CONTENT, statusText: ReasonPhrases.NO_CONTENT };
  const message = msg || count ? MSG.QUERY_TARGET_MANY_SUCCESS : MSG.QUERY_TARGET_NO_CONTENT;
  const error = { code: null, missing: false };
  const payload = responseTransformMany(rows.map((v, i, o) => v.toJSON()));
  const pagination = {
    page: paginate.page < PAGINATE_BOUNDARY ? paginate.page : undefined,
    size: paginate.page < PAGINATE_BOUNDARY ? paginate.size : undefined,
    total: paginate.page < PAGINATE_BOUNDARY ? count : undefined,
    cursor,
  };
  const hateos = null;
  res.status(statusCode).json(new Response(metadata, error, message, payload, pagination, hateos));
};

const responseSave = (res, saved, msg) => {
  const metadata = { statusCode: StatusCodes.CREATED, statusText: ReasonPhrases.CREATED };
  const message = msg || MSG.CREATE_TARGET_SUCCESS;
  const error = { code: null, missing: false };
  const transform = !saved.length ? responseTransform(saved) : saved;
  const payload = !transform.length ? { id: transform.id } : transform.map((v, i, o) => hashids.encode(v.toJSON().id));
  const pagination = null;
  const hateos = null;
  res.status(StatusCodes.CREATED).json(new Response(metadata, error, message, payload, pagination, hateos));
};

const responseUpdate = (res, old, msg) => {
  const metadata = { statusCode: StatusCodes.OK, statusText: ReasonPhrases.OK };
  const message = msg || MSG.UPDATE_TARGET_SUCCESS;
  const error = { code: null, missing: false };
  const payload = _.isEmpty(old) ? {} : old.name || old.username;
  const pagination = null;
  const hateos = null;
  res.status(StatusCodes.OK).json(new Response(metadata, error, message, payload, pagination, hateos));
};

const responseRemove = (res, old, msg) => {
  const metadata = { statusCode: StatusCodes.OK, statusText: ReasonPhrases.OK };
  const message = msg || MSG.DELETE_TARGET_SUCCESS;
  const error = { code: null, missing: false };
  const payload = _.isEmpty(old) ? {} : { name: old.name || old.username };
  const pagination = null;
  const hateos = null;
  res.status(StatusCodes.OK).json(new Response(metadata, error, message, payload, pagination, hateos));
};

const responseSignIn = (res, target) => {
  const metadata = { statusCode: StatusCodes.OK, statusText: ReasonPhrases.OK };
  const message = MSG.SIGN_IN_SUCCESS;
  const error = { code: null, missing: false };
  const payload = target;
  const pagination = null;
  const hateos = null;
  res.status(StatusCodes.OK).json(new Response(metadata, error, message, payload, pagination, hateos));
};

const responseFindOrigin = (res, target, msg) => {
  const statusCode = !_.isEmpty(target) ? StatusCodes.OK : StatusCodes.NO_CONTENT;
  const metadata = !_.isEmpty(target)
    ? { statusCode: StatusCodes.OK, statusText: ReasonPhrases.OK }
    : { statusCode: StatusCodes.NO_CONTENT, statusText: ReasonPhrases.NO_CONTENT };
  const message = msg || !_.isEmpty(target) ? MSG.QUERY_TARGET_SUCCESS : MSG.QUERY_TARGET_NO_CONTENT;
  const error = { code: null, missing: false };
  const payload = target;
  const pagination = null;
  const hateos = null;
  res.status(statusCode).json(new Response(metadata, error, message, payload, pagination, hateos));
};

const responseFindManyOrigin = (res, count, rows, paginate, cursor, msg) => {
  const statusCode = count ? StatusCodes.OK : StatusCodes.NO_CONTENT;
  const metadata = count
    ? { statusCode: StatusCodes.OK, statusText: ReasonPhrases.OK }
    : { statusCode: StatusCodes.NO_CONTENT, statusText: ReasonPhrases.NO_CONTENT };
  const message = msg || count ? MSG.QUERY_TARGET_MANY_SUCCESS : MSG.QUERY_TARGET_NO_CONTENT;
  const error = { code: null, missing: false };
  const payload = rows;
  const pagination = {
    page: paginate.page < PAGINATE_BOUNDARY ? paginate.page : undefined,
    size: paginate.page < PAGINATE_BOUNDARY ? paginate.size : undefined,
    total: paginate.page < PAGINATE_BOUNDARY ? count : undefined,
    cursor,
  };
  const hateos = null;
  res.status(statusCode).json(new Response(metadata, error, message, payload, pagination, hateos));
};

module.exports = {
  responseFindById,
  responseFindManyByCondition,
  responseSave,
  responseUpdate,
  responseRemove,
  responseSignIn,
  responseFindOrigin,
  responseFindManyOrigin,
};

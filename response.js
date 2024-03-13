const { StatusCodes, ReasonPhrases, getReasonPhrase } = require("http-status-codes");

const { CODE, MSG } = require("./constant");

class Response {
  constructor(metadata, error, message, payload, pagination, hateos) {
    this.metadata = metadata;
    this.error = error;
    this.message = message;
    this.payload = payload;
    this.pagination = pagination;
    this.hateos = hateos;
  }
}

const responseNotFound = (res) => {
  const metadata = { statusCode: StatusCodes.NOT_FOUND, statusText: ReasonPhrases.NOT_FOUND };
  const error = { code: CODE.RESOURCE_NOT_FOUND, missing: false };
  const message = MSG.RESOURCES_NOT_FOUND;
  const payload = null;
  const pagination = null;
  const hateos = null;
  res.status(StatusCodes.NOT_FOUND).json(new Response(metadata, error, message, payload, pagination, hateos));
};

const responseServerError = (err, res) => {
  const statusCode = err.options?.statusCode || err.httpStatusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const metadata = { statusCode: statusCode, statusText: getReasonPhrase(statusCode) };
  const error = { code: err.options?.code || err.code || CODE.SERVER_CANNOT_RESPONSE, missing: err.options?.missing || err.missing || false };
  const message = err.options?.message || err.message || MSG.SERVER_CANNOT_RESPONSE;
  const payload = null;
  const pagination = null;
  const hateos = null;
  res.status(statusCode).json(new Response(metadata, error, message, payload, pagination, hateos));
};

module.exports = {
  Response,
  responseNotFound,
  responseServerError,
};

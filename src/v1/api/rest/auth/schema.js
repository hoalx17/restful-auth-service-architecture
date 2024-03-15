const Joi = require("joi");

const { SCHEMA } = require("./constant");

const joiRoleCreate = Joi.object({
  name: Joi.string().required().messages({
    "any.required": SCHEMA.ROLE_NAME_MUST_NOT_EMPTY,
  }),
});

const joiRoleUpdate = Joi.object({
  name: Joi.string().required().messages({
    "any.required": SCHEMA.ROLE_NAME_MUST_NOT_EMPTY,
  }),
});

const joiUserCreate = Joi.object({
  username: Joi.string().required().messages({
    "any.required": SCHEMA.USER_NAME_MUST_NOT_EMPTY,
  }),
  password: Joi.string().optional(),
  firstName: Joi.string().required().messages({
    "any.required": SCHEMA.USER_FIRST_NAME_MUST_NOT_EMPTY,
  }),
  lastName: Joi.string().required().messages({
    "any.required": SCHEMA.USER_LAST_NAME_MUST_NOT_EMPTY,
  }),
  birthDay: Joi.date().optional().messages({
    "date.base": SCHEMA.USER_BIRTHDAY_MUST_BE_DATE_TIME,
  }),
  gender: Joi.boolean().optional().messages({
    "boolean.base": SCHEMA.USER_GENDER_MUST_BE_BOOLEAN,
  }),
  email: Joi.string().required().messages({
    "any.required": SCHEMA.USER_EMAIL_MUST_NOT_EMPTY,
  }),
  tel: Joi.string().optional(),
  imageUrl: Joi.string().optional(),
  fingerprint: Joi.string().required().messages({
    "any.required": SCHEMA.USER_FINGERPRINT_MUST_NOT_EMPTY,
  }),
  activated: Joi.boolean().optional().messages({
    "boolean.base": SCHEMA.USER_ACTIVATED_STATUS_MUST_BE_BOOLEAN,
  }),
  confirmCode: Joi.string().required().messages({
    "any.required": SCHEMA.USER_CONFIRM_CODE_MUST_NOT_EMPTY,
  }),
  isPendingDelete: Joi.boolean().optional(),
  provider: Joi.string().optional(),
});

const joiUserUpdate = Joi.object({
  birthDay: Joi.date().optional().messages({
    "date.base": SCHEMA.USER_BIRTHDAY_MUST_BE_DATE_TIME,
  }),
  gender: Joi.boolean().optional().messages({
    "boolean.base": SCHEMA.USER_GENDER_MUST_BE_BOOLEAN,
  }),
  imageUrl: Joi.string().optional(),
});

const joiUserVerifySignatureCreate = Joi.object({
  accessSignature: Joi.string().required().messages({
    "any.required": SCHEMA.USER_VERIFY_SIGNATURE_ACCESS_MUST_NOT_EMPTY,
  }),
  accessSignatureExpiredAt: Joi.date().required().messages({
    "any.required": SCHEMA.USER_VERIFY_SIGNATURE_ACCESS_MUST_NOT_EMPTY,
    "date.base": SCHEMA.USER_VERIFY_SIGNATURE_ACCESS_EXPIRED_AT_MUST_BE_DATE_TIME,
  }),
  refreshSignature: Joi.string().required().messages({
    "any.required": SCHEMA.USER_VERIFY_SIGNATURE_REFRESH_MUST_NOT_EMPTY,
  }),
  refreshSignatureExpiredAt: Joi.date().required().messages({
    "any.required": SCHEMA.USER_VERIFY_SIGNATURE_REFRESH_MUST_NOT_EMPTY,
    "date.base": SCHEMA.USER_VERIFY_SIGNATURE_REFRESH_EXPIRED_AT_MUST_BE_DATE_TIME,
  }),
});

module.exports = {
  roleSchema: {
    joiRoleCreate,
    joiRoleUpdate,
  },
  userSchema: {
    joiUserCreate,
    joiUserUpdate,
  },
  userVerifySignature: {
    joiUserVerifySignatureCreate,
  },
};

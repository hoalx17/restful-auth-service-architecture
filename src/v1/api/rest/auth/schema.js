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
    date: SCHEMA.USER_BIRTHDAY_MUST_BE_DATE_TIME,
  }),
  gender: Joi.boolean().optional().messages({
    boolean: SCHEMA.USER_GENDER_MUST_BE_BOOLEAN,
  }),
  email: Joi.string().required().messages({
    "any.required": SCHEMA.USER_EMAIL_MUST_NOT_EMPTY,
  }),
  tel: Joi.string().required().messages({
    "any.required": SCHEMA.USER_TEL_MUST_NOT_EMPTY,
  }),
  imageUrl: Joi.string().optional(),
  fingerprint: Joi.string().required().messages({
    "any.required": SCHEMA.USER_FINGERPRINT_MUST_NOT_EMPTY,
  }),
  activated: Joi.boolean().optional().messages({
    boolean: SCHEMA.USER_ACTIVATED_STATUS_MUST_BE_BOOLEAN,
  }),
  confirmCode: Joi.string().required().messages({
    "any.required": SCHEMA.USER_CONFIRM_CODE_MUST_NOT_EMPTY,
  }),
  isPendingDelete: Joi.boolean().required().messages({
    "any.required": SCHEMA.USER_IS_PENDING_DELETE_MUST_NOT_EMPTY,
  }),
});

const joiUserUpdate = Joi.object({
  password: Joi.string().optional(),
  birthDay: Joi.date().optional().messages({
    date: SCHEMA.USER_BIRTHDAY_MUST_BE_DATE_TIME,
  }),
  imageUrl: Joi.string().optional(),
  activated: Joi.boolean().optional().messages({
    boolean: SCHEMA.USER_ACTIVATED_STATUS_MUST_BE_BOOLEAN,
  }),
  isPendingDelete: Joi.boolean().required().messages({
    "any.required": SCHEMA.USER_IS_PENDING_DELETE_MUST_NOT_EMPTY,
  }),
});

const joiUserVerifySignatureCreate = Joi.object({
  accessSignature: Joi.string().required().messages({
    "any.required": SCHEMA.USER_VERIFY_SIGNATURE_ACCESS_MUST_NOT_EMPTY,
  }),
  accessSignatureExpiredAt: Joi.date().required().messages({
    "any.required": SCHEMA.USER_VERIFY_SIGNATURE_ACCESS_MUST_NOT_EMPTY,
    date: SCHEMA.USER_VERIFY_SIGNATURE_ACCESS_EXPIRED_AT_MUST_BE_DATE_TIME,
  }),
  refreshSignature: Joi.string().required().messages({
    "any.required": SCHEMA.USER_VERIFY_SIGNATURE_REFRESH_MUST_NOT_EMPTY,
  }),
  refreshSignatureExpiredAt: Joi.date().required().messages({
    "any.required": SCHEMA.USER_VERIFY_SIGNATURE_REFRESH_MUST_NOT_EMPTY,
    date: SCHEMA.USER_VERIFY_SIGNATURE_REFRESH_EXPIRED_AT_MUST_BE_DATE_TIME,
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

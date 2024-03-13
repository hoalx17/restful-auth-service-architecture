module.exports = {
  CODE: {
    /** Transform */
    REQUEST_TRANSFORM_FAILURE: "ERR_AUTH_TRANSFORM_1",
    RESPONSE_TRANSFORM_FAILURE: "ERR_AUTH_TRANSFORM_2",

    /** Validator */
    VALIDATE_FAILURE: "ERR_AUTH_VALIDATION_1",
    USERNAME_OR_PASSWORD_MUST_NOT_EMPTY: "ERR_AUTH_VALIDATION_2",
    USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY: "ERR_AUTH_VALIDATION_3",

    /** Repository */
    QUERY_FAILURE: "ERR_AUTH_REPOSITORY_1",
    QUERY_MANY_FAILURE: "ERR_AUTH_REPOSITORY_2",
    CREATE_FAILURE: "ERR_AUTH_REPOSITORY_3",
    CREATE_MANY_FAILURE: "ERR_AUTH_REPOSITORY_4",
    UPDATE_FAILURE: "ERR_AUTH_REPOSITORY_5",
    NOT_MODIFY: "ERR_AUTH_REPOSITORY_6",
    UPDATE_MANY_FAILURE: "ERR_AUTH_REPOSITORY_7",
    DELETE_FAILURE: "ERR_AUTH_REPOSITORY_8",
    DELETE_MANY_FAILURE: "ERR_AUTH_REPOSITORY_9",

    /** Middleware */
    REQUIRED_SIGN_IN_TO_CONTINUE: "ERR_AUTH_MIDDLEWARE_1",
    TOKEN_HAS_BEEN_EXPIRED: "ERR_AUTH_MIDDLEWARE_2",

    /** Service */
    QUERY_TARGET_FAILURE: "ERR_AUTH_SERVICE_1",
    QUERY_TARGET_MANY_FAILURE: "ERR_AUTH_SERVICE_2",
    CREATE_TARGET_FAILURE: "ERR_AUTH_SERVICE_3",
    CREATE_TARGET_MANY_FAILURE: "ERR_AUTH_SERVICE_4",
    UPDATE_TARGET_FAILURE: "ERR_AUTH_SERVICE_5",
    UPDATE_TARGET_MANY_FAILURE: "ERR_AUTH_SERVICE_6",
    DELETE_TARGET_FAILURE: "ERR_AUTH_SERVICE_7",
    DELETE_TARGET_MANY_FAILURE: "ERR_AUTH_SERVICE_8",

    SIGNUP_FAILURE: "ERR_AUTH_SERVICE_7",
    ACTIVATE_FAILURE: "ERR_AUTH_SERVICE_8",
    CONFIRM_CODE_NOT_MATCH: "ERR_AUTH_SERVICE_9",
    SIGN_IN_FAILURE: "ERR_AUTH_SERVICE_10",
    PROFILE_NOT_FOUND: "ERR_AUTH_SERVICE_11",
    USERNAME_OR_PASSWORD_NOT_MATCH: "ERR_AUTH_SERVICE_12",
    DEACTIVATE_FAILURE: "ERR_AUTH_SERVICE_13",
    SIGN_OUT_FAILURE: "ERR_AUTH_SERVICE_14",
    PROFILE_HAS_NOT_LOGIN_BEFORE: "ERR_AUTH_SERVICE_15",
    GET_PROFILE_INFO_FAILURE: "ERR_AUTH_SERVICE_16",
    DELETE_PROFILE_FAILURE: "ERR_AUTH_SERVICE_17",
    RESET_PASSWORD_FAILURE: "ERR_AUTH_SERVICE_18",

    /** Token */
    SIGN_TOKEN_FAILURE: "ERR_AUTH_TOKEN_1",
    GET_TOKEN_FROM_HEADER_FAILURE: "ERR_AUTH_TOKEN_2",
    AUTHORIZATION_HEADER_MUST_NOT_EMPTY: "ERR_AUTH_TOKEN_3",
    VERIFY_TOKEN_FAILURE: "ERR_AUTH_TOKEN_4",
  },
  MSG: {
    /** Transform */
    REQUEST_TRANSFORM_FAILURE: "Transform on Schema return failure result!",
    RESPONSE_TRANSFORM_FAILURE: "Transform on Schema return failure result!",

    /** Validator */
    VALIDATOR_FAILURE: "Validator on Schema return failure result!",
    USERNAME_OR_PASSWORD_MUST_NOT_EMPTY: "Username or password params must not be empty!",
    USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY: "Username or confirmCode params must not be empty!",

    /** Repository */
    QUERY_FAILURE: "Query resource failure!",
    QUERY_MANY_FAILURE: "Query resource many failure!",
    CREATE_FAILURE: "Create resource failure!",
    CREATE_MANY_FAILURE: "Create resource many failure!",
    UPDATE_FAILURE: "Update resource failure!",
    NOT_MODIFY: "Update resource failure: not modify!",
    UPDATE_MANY_FAILURE: "Update resource many failure!",
    DELETE_FAILURE: "Delete resource failure!",
    DELETE_MANY_FAILURE: "Delete resource many failure!",

    /** Middleware */
    REQUIRED_SIGN_IN_TO_CONTINUE: "Required sign in to continue!",
    TOKEN_HAS_BEEN_EXPIRED: "Token has been expired!",

    /** Service */
    QUERY_TARGET_FAILURE: "Query resource failure!",
    QUERY_TARGET_SUCCESS: "Query resource success!",
    QUERY_TARGET_NO_CONTENT: "Query resource success with no content!",
    QUERY_TARGET_MANY_FAILURE: "Query resource many failure!",
    QUERY_TARGET_MANY_SUCCESS: "Query resource many success!",
    QUERY_TARGET_MANY_NO_CONTENT: "Query resource many success with no content!",
    CREATE_TARGET_FAILURE: "Create resource failure!",
    CREATE_TARGET_SUCCESS: "Create resource success!",
    CREATE_TARGET_MANY_FAILURE: "Create resource many failure!",
    CREATE_TARGET_MANY_SUCCESS: "Create resource many success!",
    UPDATE_TARGET_FAILURE: "Update resource failure!",
    UPDATE_TARGET_SUCCESS: "Update resource success!",
    UPDATE_TARGET_MANY_FAILURE: "Update resource many failure!",
    UPDATE_TARGET_MANY_SUCCESS: "Update resource many success!",
    DELETE_TARGET_FAILURE: "Delete resource failure!",
    DELETE_TARGET_SUCCESS: "Delete resource success!",
    DELETE_TARGET_MANY_FAILURE: "Delete resource many failure!",
    DELETE_TARGET_MANY_SUCCESS: "Delete resource many success!",

    SIGNUP_FAILURE: "Signup new profile failure!",
    SIGNUP_SUCCESS: "Signup new profile success!",
    ACTIVATE_FAILURE: "Activate profile failure!",
    ACTIVATE_SUCCESS: "Activate profile success!",
    CONFIRM_CODE_NOT_MATCH: "Activate profile failure: confirmCode not match!",
    SIGN_IN_FAILURE: "Login into profile failure!",
    SIGN_IN_SUCCESS: "Login into profile success!",
    USERNAME_OR_PASSWORD_NOT_MATCH: "Username or password not match, try again!",
    DEACTIVATE_FAILURE: "Deactivate profile failure!",
    DEACTIVATE_SUCCESS: "Deactivate profile success!",
    SIGN_OUT_FAILURE: "Logout from profile failure!",
    SIGN_OUT_SUCCESS: "Logout from resource success!",
    PROFILE_HAS_NOT_LOGIN_BEFORE: "Profile has not login before!",
    GET_PROFILE_INFO_FAILURE: "Get profile information failure!",
    GET_PROFILE_INFO_SUCCESS: "Get profile information success!",
    PROFILE_NOT_FOUND: "Profile not found: wrong username and password!",
    DELETE_PROFILE_FAILURE: "Delete profile failure!",
    DELETE_PROFILE_SUCCESS: "Delete profile success!",
    RESET_PASSWORD_FAILURE: "Reset password of profile failure!",
    RESET_PASSWORD_SUCCESS: "Reset password of profile success!",

    /** Token */
    SIGN_TOKEN_FAILURE: "Sign a token failure!",
    GET_TOKEN_FROM_HEADER_FAILURE: "Get token from header failure!",
    AUTHORIZATION_HEADER_MUST_NOT_EMPTY: "Authorization header must not empty!",
    VERIFY_TOKEN_FAILURE: "Verify token failure!",
  },

  ERR: {
    NOT_MODIFIED: "not modified because no content found",
    USERNAME_OR_PASSWORD_MUST_NOT_EMPTY: "username or password must not empty",
    USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY: "username or confirmCode must not empty",
    CONFIRM_CODE_NOT_MATCH: "confirmCode does not match",
    PROFILE_NOT_FOUND: "profile not found: wrong username or password",
    USERNAME_OR_PASSWORD_NOT_MATCH: "username or password not match",
    PROFILE_HAS_NOT_LOGIN_BEFORE: "profile has not login before",
    AUTHORIZATION_HEADER_MUST_NOT_EMPTY: "authorization header must not be empty",
    TOKEN_HAS_BEEN_EXPIRED: "token has been expired",
    REQUIRED_SIGN_IN_TO_CONTINUE: "sign in to continue",
  },

  SCHEMA: {
    ROLE_NAME_MUST_NOT_EMPTY: "Role: name must not empty!",
    USER_NAME_MUST_NOT_EMPTY: "User: username must not empty!",
    USER_FIRST_NAME_MUST_NOT_EMPTY: "User: first name must not empty!",
    USER_LAST_NAME_MUST_NOT_EMPTY: "User: last name must not empty!",
    USER_BIRTHDAY_MUST_BE_DATE_TIME: "User: birth day must be date time!",
    USER_GENDER_MUST_BE_BOOLEAN: "User: gender must be boolean!",
    USER_EMAIL_MUST_NOT_EMPTY: "User: email must not empty!",
    USER_TEL_MUST_NOT_EMPTY: "User: tel must not empty!",
    USER_FINGERPRINT_MUST_NOT_EMPTY: "User: fingerprint must not empty!",
    USER_ACTIVATED_STATUS_MUST_BE_BOOLEAN: "User: activated status must be boolean!",
    USER_CONFIRM_CODE_MUST_NOT_EMPTY: "User: confirmCode must not empty!",
    USER_VERIFY_SIGNATURE_ACCESS_MUST_NOT_EMPTY: "User Verify Signature: access token must not be empty!",
    USER_VERIFY_SIGNATURE_ACCESS_EXPIRED_AT_MUST_NOT_EMPTY: "User Verify Signature: access token expired at must not be empty!",
    USER_VERIFY_SIGNATURE_ACCESS_EXPIRED_AT_MUST_BE_DATE_TIME: "User Verify Signature: access token expired at must be date time!",
    USER_VERIFY_SIGNATURE_REFRESH_MUST_NOT_EMPTY: "User Verify Signature: refresh token must not be empty!",
    USER_VERIFY_SIGNATURE_REFRESH_EXPIRED_AT_MUST_NOT_EMPTY: "User Verify Signature: refresh token expired at must not be empty!",
    USER_VERIFY_SIGNATURE_REFRESH_EXPIRED_AT_MUST_BE_DATE_TIME: "User Verify Signature: refresh token expired at must be date time!",
  },
};
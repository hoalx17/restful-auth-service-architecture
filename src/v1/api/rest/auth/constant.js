module.exports = {
  USER_RESOURCE_NAME: "USER",
  ROLE_RESOURCE_NAME: "ROLE",
  COMMON: {
    REQUIRED_HEADERS_NAME: ["Authorization"],
    DEFAULT_ROLE_ID: 1,
    GOOGLE_PROVIDER_NAME: "Google",
  },

  CODE: {
    /** Transform */
    REQUEST_TRANSFORM_FAILURE: "ERR_AUTH_TRANSFORM_1",
    RESPONSE_TRANSFORM_FAILURE: "ERR_AUTH_TRANSFORM_2",

    /** Validator */
    VALIDATE_FAILURE: "ERR_AUTH_VALIDATION_1",
    USERNAME_OR_PASSWORD_MUST_NOT_EMPTY: "ERR_AUTH_VALIDATION_2",
    USERNAME_OR_CONFIRM_CODE_MUST_NOT_EMPTY: "ERR_AUTH_VALIDATION_3",
    USERNAME_PASSWORD_OR_CONFIRM_CODE_MUST_NOT_EMPTY: "ERR_AUTH_VALIDATION_4",
    REFRESH_TOKEN_MUST_NOT_EMPTY: "ERR_AUTH_VALIDATION_5",
    PASSWORD_OR_NEW_PASSWORD_MUST_NOT_EMPTY: "ERR_AUTH_VALIDATION_6",
    NEW_PASSWORD_MUST_NOT_EMPTY: "ERR_AUTH_VALIDATION_7",

    /** Repository */
    QUERY_FAILURE: "ERR_AUTH_REPOSITORY_1",
    QUERY_MANY_FAILURE: "ERR_AUTH_REPOSITORY_2",
    QUERY_OR_CREATE_FAILURE: "ERR_AUTH_REPOSITORY_3",
    CREATE_FAILURE: "ERR_AUTH_REPOSITORY_4",
    CREATE_MANY_FAILURE: "ERR_AUTH_REPOSITORY_5",
    UPDATE_FAILURE: "ERR_AUTH_REPOSITORY_6",
    NOT_MODIFY: "ERR_AUTH_REPOSITORY_7",
    UPDATE_MANY_FAILURE: "ERR_AUTH_REPOSITORY_8",
    DELETE_FAILURE: "ERR_AUTH_REPOSITORY_9",
    DELETE_MANY_FAILURE: "ERR_AUTH_REPOSITORY_10",

    /** Middleware */
    REQUIRED_SIGN_IN_TO_CONTINUE: "ERR_AUTH_MIDDLEWARE_1",
    TOKEN_HAS_BEEN_EXPIRED: "ERR_AUTH_MIDDLEWARE_2",
    SIGNATURE_NOT_MATCH: "ERR_AUTH_MIDDLEWARE_3",
    ILLEGAL_SESSION: "ERR_AUTH_MIDDLEWARE_4",
    REQUIRED_PENDING_DELETE_TO_CONTINUE: "ERR_AUTH_MIDDLEWARE_5",

    /** Service */
    QUERY_TARGET_FAILURE: "ERR_AUTH_SERVICE_1",
    QUERY_TARGET_MANY_FAILURE: "ERR_AUTH_SERVICE_2",
    CREATE_TARGET_FAILURE: "ERR_AUTH_SERVICE_3",
    CREATE_TARGET_MANY_FAILURE: "ERR_AUTH_SERVICE_4",
    UPDATE_TARGET_FAILURE: "ERR_AUTH_SERVICE_5",
    UPDATE_TARGET_MANY_FAILURE: "ERR_AUTH_SERVICE_6",
    DELETE_TARGET_FAILURE: "ERR_AUTH_SERVICE_7",
    DELETE_TARGET_MANY_FAILURE: "ERR_AUTH_SERVICE_8",

    SIGNUP_FAILURE: "ERR_AUTH_SERVICE_9",
    ACTIVATE_FAILURE: "ERR_AUTH_SERVICE_10",
    CONFIRM_CODE_NOT_MATCH: "ERR_AUTH_SERVICE_11",
    SIGN_IN_FAILURE: "ERR_AUTH_SERVICE_12",
    ENSURE_LEGAL_SESSION_FAILURE: "ERR_AUTH_SERVICE_13",
    ENSURE_CAN_MAKE_SESSION_FAILURE: "ERR_AUTH_SERVICE_14",
    MAX_SESSION_REACH: "ERR_AUTH_SERVICE_15",
    PROFILE_NOT_FOUND: "ERR_AUTH_SERVICE_16",
    USERNAME_OR_PASSWORD_NOT_MATCH: "ERR_AUTH_SERVICE_17",
    GET_ALL_SESSION_FAILURE: "ERR_AUTH_SERVICE_18",
    DEACTIVATE_FAILURE: "ERR_AUTH_SERVICE_19",
    SIGN_OUT_FAILURE: "ERR_AUTH_SERVICE_20",
    GET_PROFILE_INFO_FAILURE: "ERR_AUTH_SERVICE_21",
    DELETE_PROFILE_FAILURE: "ERR_AUTH_SERVICE_22",
    CANCEL_DELETE_PROFILE_FAILURE: "ERR_AUTH_SERVICE_23",
    TERMINATE_SESSIONS_FAILURES: "ERR_AUTH_SERVICE_24",
    TERMINATE_SESSION_FAILURES: "ERR_AUTH_SERVICE_25",
    ENSURE_NOT_CURRENT_SESSION_FAILURE: "ERR_AUTH_SERVICE_26",
    CANNOT_TERMINAL_CURRENT_SESSION: "ERR_AUTH_SERVICE_27",
    RESET_PASSWORD_FAILURE: "ERR_AUTH_SERVICE_28",
    TERMINATE_ALL_SESSIONS_FAILURE: "ERR_AUTH_SERVICE_29",
    REFRESH_SESSION_FAILURE: "ERR_AUTH_SERVICE_30",
    REFRESH_TOKEN_NOT_MATCH: "ERR_AUTH_SERVICE_31",
    UPDATE_PROFILE_INFORMATION_FAILURE: "ERR_AUTH_SERVICE_33",
    CHANGE_PROFILE_PASSWORD_FAILURE: "ERR_AUTH_SERVICE_34",
    OAUTH_SIGN_IN_FAILURE: "ERR_AUTH_SERVICE_35",
    GOOGLE_SIGN_IN_FAILURE: "ERR_AUTH_SERVICE_36",

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
    USERNAME_PASSWORD_OR_CONFIRM_CODE_MUST_NOT_EMPTY: "Username, password or confirmCode params must not be empty!",
    REFRESH_TOKEN_MUST_NOT_EMPTY: "Refresh token must not be empty!",
    PASSWORD_OR_NEW_PASSWORD_MUST_NOT_EMPTY: "Password or new password must not be empty!",
    NEW_PASSWORD_MUST_NOT_EMPTY: "New password must not be empty!",

    /** Repository */
    QUERY_FAILURE: "Query resource failure!",
    QUERY_MANY_FAILURE: "Query resource many failure!",
    QUERY_OR_CREATE_FAILURE: "Query or create resource failure!",
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
    SIGNATURE_NOT_MATCH: "Signature not match!",
    ILLEGAL_SESSION: "Session is invalid!",
    REQUIRED_PENDING_DELETE: "Required pending delete to continue!",
    REQUIRED_PENDING_DELETE_TO_CONTINUE: "Only profile is pending delete can to this!",

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
    ENSURE_LEGAL_SESSION_FAILURE: "Ensure session is legal failure!",
    ENSURE_CAN_MAKE_SESSION_FAILURE: "Ensure can make new session failure!",
    MAX_SESSION_REACH: "Max session reach. Sign out in other device to sign in in this device!",
    PROFILE_NOT_FOUND: "Profile not found: wrong username and password!",
    USERNAME_OR_PASSWORD_NOT_MATCH: "Username or password not match, try again!",
    SIGN_IN_SUCCESS: "Login into profile success!",
    GET_ALL_SESSION_FAILURE: "Get all activate session failure!",
    GET_ALL_SESSION_SUCCESS: "Get all activate session success!",
    DEACTIVATE_FAILURE: "Deactivate profile failure!",
    DEACTIVATE_SUCCESS: "Deactivate profile success!",
    SIGN_OUT_FAILURE: "Logout from profile failure!",
    SIGN_OUT_SUCCESS: "Logout from profile success!",
    GET_PROFILE_INFO_FAILURE: "Get profile information failure!",
    GET_PROFILE_INFO_SUCCESS: "Get profile information success!",
    DELETE_PROFILE_FAILURE: "Delete profile failure!",
    DELETE_PROFILE_SUCCESS: "Delete profile success!",
    CANCEL_DELETE_PROFILE_FAILURE: "Cancel delete profile failure!",
    CANCEL_DELETE_PROFILE_SUCCESS: "Cancel delete profile success!",
    TERMINATE_SESSIONS_FAILURES: "Terminal all activate session failure!",
    TERMINATE_SESSIONS_SUCCESS: "Terminal all activate session success!",
    TERMINATE_SESSION_FAILURES: "Terminal activate session failure!",
    ENSURE_NOT_CURRENT_SESSION_FAILURE: "Ensure not current session failure!",
    CANNOT_TERMINAL_CURRENT_SESSION: "Cannot terminal current session!",
    TERMINATE_SESSION_SUCCESS: "Terminal activate session success!",
    RESET_PASSWORD_FAILURE: "Reset password of profile failure!",
    TERMINATE_ALL_SESSIONS_FAILURE: "Terminal all session of current user failure!",
    RESET_PASSWORD_SUCCESS: "Reset password of profile success!",
    REFRESH_SESSION_FAILURE: "Refresh session failure!",
    REFRESH_TOKEN_NOT_MATCH: "Refresh token not match!",
    REFRESH_SESSION_SUCCESS: "Refresh session success!",
    UPDATE_PROFILE_INFORMATION_FAILURE: "Update profile information failure!",
    UPDATE_PROFILE_INFORMATION_SUCCESS: "Update profile information success!",
    CHANGE_PROFILE_PASSWORD_FAILURE: "Change profile password failure!",
    CHANGE_PROFILE_PASSWORD_SUCCESS: "Change profile password success!",
    OAUTH_SIGN_IN_FAILURE: "Sign in with OAuth failure!",
    OAUTH_SIGN_IN_SUCCESS: "Sign in with OAuth success!",
    GOOGLE_SIGN_IN_FAILURE: "Sign in with Google OAuth failure!",
    GOOGLE_SIGN_IN_SUCCESS: "Sign in with Google OAuth success!",

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
    USERNAME_PASSWORD_OR_CONFIRM_CODE_MUST_NOT_EMPTY: "username, password or confirmCode must not empty",
    CONFIRM_CODE_NOT_MATCH: "confirmCode does not match",
    PROFILE_NOT_FOUND: "profile not found: wrong username or password",
    USERNAME_OR_PASSWORD_NOT_MATCH: "username or password not match",
    AUTHORIZATION_HEADER_MUST_NOT_EMPTY: "authorization header must not be empty",
    TOKEN_HAS_BEEN_EXPIRED: "token has been expired",
    REQUIRED_SIGN_IN_TO_CONTINUE: "sign in to continue",
    SIGNATURE_NOT_MATCH: "signature not match",
    ILLEGAL_SESSION: "illegal session",
    MAX_SESSION_REACH: "max session reach",
    REQUIRED_PENDING_DELETE_TO_CONTINUE: "only pending delete can continue",
    CANNOT_TERMINAL_CURRENT_SESSION: "cannot terminal current session",
    REFRESH_TOKEN_MUST_NOT_EMPTY: "refresh token must not be empty",
    REFRESH_TOKEN_NOT_MATCH: "refresh token not match",
    PASSWORD_OR_NEW_PASSWORD_MUST_NOT_EMPTY: "password, or new password must not empty",
    NEW_PASSWORD_MUST_NOT_EMPTY: "new password must not be empty",
  },

  SCHEMA: {
    ROLE_NAME_MUST_NOT_EMPTY: "Role: name must not empty!",
    USER_NAME_MUST_NOT_EMPTY: "User: username must not empty!",
    USER_FIRST_NAME_MUST_NOT_EMPTY: "User: first name must not empty!",
    USER_LAST_NAME_MUST_NOT_EMPTY: "User: last name must not empty!",
    USER_BIRTHDAY_MUST_BE_DATE_TIME: "User: birth day must be date time!",
    USER_GENDER_MUST_BE_BOOLEAN: "User: gender must be boolean!",
    USER_EMAIL_MUST_NOT_EMPTY: "User: email must not empty!",
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

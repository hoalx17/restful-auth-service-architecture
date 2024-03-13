const { PORT, NODE_ENV } = process.env;

module.exports = {
  ON_RELEASE: NODE_ENV === "production",

  CODE: {
    /** Server Constant */
    RESOURCE_NOT_FOUND: "ERR_RESOURCE_NOT_FOUND",
    SERVER_CANNOT_RESPONSE: "ERR_SERVICE_CAN_NOT_RESPONSE",
  },
  MSG: {
    /** Server Constant */
    RESOURCES_NOT_FOUND: `Resources not found! Check APIs documentation for more information!`,
    SERVER_CANNOT_RESPONSE: `Server cannot send response right now because unknown exception!`,
    SERVER_START_SUCCESS: `Server is running at address: http://localhost:${PORT}!`,
    SERVER_START_FAILURE: `Server start failure. Check log file for more information!`,

    /** Database Constant */
    SEQUELIZE_CONNECTION_ESTABLISHED_SUCCESS: "Sequelize connection has been established successfully!",
    SEQUELIZE_CONNECTION_ESTABLISHED_FAILURE: "Unable to connect to the database via Sequelize!",

    /** Route Constant */
    ROUTE_ENDPOINT_ESTABLISHED_SUCCESS: "Route endpoint has been established successfully!",
    ROUTE_ENDPOINT_ESTABLISHED_FAILURE: "Unable to configure route endpoint!",
  },
};

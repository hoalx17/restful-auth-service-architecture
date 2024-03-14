const cloudinary = require("cloudinary").v2;
const chalk = require("chalk");
const { StatusCodes } = require("http-status-codes");

const { ON_RELEASE } = require("../../../constant");
const { CODE, MSG } = require("./constant");

class CloudinaryClient {
  static getInstance() {
    try {
      if (!this.instance) {
        const { CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY, CLOUDINARY_CLOUD_NAME } = process.env;
        cloudinary.config({
          api_key: CLOUDINARY_API_KEY,
          api_secret: CLOUDINARY_SECRET_KEY,
          cloud_name: CLOUDINARY_CLOUD_NAME,
        });
        this.instance = cloudinary;
      }
      return this.instance;
    } catch (error) {
      ON_RELEASE || console.log(`Cloudinary Client: ${chalk.red(error.message)}`);
      throwNormalError(error, CODE.GET_CLOUDINARY_CLIENT_FAILURE, MSG.GET_CLOUDINARY_CLIENT_FAILURE, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = CloudinaryClient;

const { Readable } = require("stream");

const { CloudinaryClient } = require("../client");
const { ALLOW_IMAGE_FORMAT } = require("./constant");
const { ON_RELEASE } = require("../../../constant");

const { CLOUDINARY_FOLDER_ID } = process.env;

const uploadSingleImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const cloudinary = CloudinaryClient.getInstance();
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      folder: CLOUDINARY_FOLDER_ID,
      allowed_formats: ALLOW_IMAGE_FORMAT,
    };
    let uploadStream = cloudinary.uploader.upload_stream(options, function (error, result) {
      if (error) {
        ON_RELEASE || console.log(`Cloudinary: ${chalk.red(error.message)}`);
        reject(error);
      }
      resolve(result);
    });
    Readable.from(buffer).pipe(uploadStream);
  });
};

module.exports = {
  uploadSingleImage,
};

const express = require("express");
const multer = require("multer");
const path = require("path");
const { StatusCodes } = require("http-status-codes");

const { roleController, devController } = require("./controller");
const {
  Constant: { ALLOW_IMAGE_FORMAT, CODE, MSG, ERR },
} = require("../../../util");
const { newNormalError } = require("../../../error");

const upload = multer({
  fileFilter: (req, file, callback) => {
    const fileType = path.extname(file.originalname);
    const isValidFileType = ALLOW_IMAGE_FORMAT.includes(fileType.slice(1));
    if (!isValidFileType) {
      const error = new Error(ERR.FILE_TYPE_NOT_ALLOW);
      return callback(newNormalError(error, CODE.FILE_TYPE_NOT_ALLOW, MSG.FILE_TYPE_NOT_ALLOW, StatusCodes.BAD_REQUEST));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});

const router = express.Router();
const roleRouter = express.Router();

/** Role Router */
roleRouter.get("/:id", roleController.findRoleByIdController);
roleRouter.get("/", roleController.findManyRoleByConditionController);
roleRouter.post("/", roleController.saveRoleController);
roleRouter.patch("/:id", roleController.updateRoleByIdController);
roleRouter.delete("/:id", roleController.removeRoleByIdController);

/** Auth Router */
router.get("/dev", devController);
router.use("/roles", roleRouter);

module.exports = router;

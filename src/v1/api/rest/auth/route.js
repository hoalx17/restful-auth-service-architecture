const express = require("express");
const multer = require("multer");
const path = require("path");
const { StatusCodes } = require("http-status-codes");

const { roleController, devController, authController } = require("./controller");
const {
  Constant: { ALLOW_IMAGE_FORMAT, CODE, MSG, ERR },
} = require("../../../util");
const { newNormalError } = require("../../../error");
const middleware = require("./middleware");

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

router.post("/sign-up", upload.single("imageUrl"), authController.signUpController);
router.patch("/activate", authController.activateController);
router.post("/sign-in", authController.signInController);
router.get("/me", middleware.requireSignIn, authController.meController);
router.get("/sessions", middleware.requireSignIn, authController.getActivateSessionsController);
router.patch("/deactivate", middleware.requireSignIn, authController.deactivateController);
router.delete("/sign-out", middleware.requireSignIn, authController.signOutController);
router.delete("/delete", middleware.requireSignIn, authController.removeController);

module.exports = router;

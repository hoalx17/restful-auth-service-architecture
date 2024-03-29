const express = require("express");
const multer = require("multer");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const passport = require("passport");

const { roleController, devController, authController, oauthController } = require("./controller");
const {
  Constant: { ALLOW_IMAGE_FORMAT, CODE, MSG, ERR },
} = require("../../../util");
const { newNormalError, newServerError } = require("../../../error");
const middleware = require("./middleware");

const upload = multer({
  fileFilter: (req, file, callback) => {
    const fileType = path.extname(file.originalname);
    const isValidFileType = ALLOW_IMAGE_FORMAT.includes(fileType.slice(1));
    if (!isValidFileType) {
      const error = newServerError(ERR.FILE_TYPE_NOT_ALLOW);
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
router.get("/dev", passport.authenticate("jwt", { session: false }), devController);
router.use("/roles", roleRouter);

/**
router.post("/sign-up", upload.single("imageUrl"), authController.signUpController);
router.patch("/activate", authController.activateController);
router.post("/sign-in", authController.signInController);
router.get("/me", middleware.requireSignIn, authController.meController);
router.patch("/me", upload.single("imageUrl"), middleware.requireSignIn, authController.updateProfileController);
router.patch("/deactivate", middleware.requireSignIn, authController.deactivateController);
router.delete("/sign-out", middleware.requireSignIn, authController.signOutController);
router.delete("/delete", middleware.requireSignIn, authController.removeController);
router.patch("/cancel-delete", middleware.requireSignIn, middleware.requirePendingDelete, authController.cancelRemoveController);
router.get("/sessions", middleware.requireSignIn, authController.getSessionsController);
router.delete("/sessions", middleware.requireSignIn, authController.terminateSessionsController);
router.delete("/sessions/:id", middleware.requireSignIn, authController.terminateSessionController);
router.patch("/reset-password", authController.resetPasswordController);
router.patch("/change-password", middleware.requireSignIn, authController.changePasswordController);
router.patch("/refresh", middleware.requireSignIn, authController.refreshController);
*/

router.post("/sign-up", upload.single("imageUrl"), authController.signUpController);
router.patch("/activate", authController.activateController);
router.post("/sign-in", authController.signInController);
router.get("/me", passport.authenticate("jwt", { session: false }), authController.getProfileController);
router.patch("/me", upload.single("imageUrl"), passport.authenticate("jwt", { session: false }), authController.updateProfileController);
router.patch("/deactivate", passport.authenticate("jwt", { session: false }), authController.deactivateController);
router.delete("/sign-out", passport.authenticate("jwt", { session: false }), authController.signOutController);
router.delete("/delete", passport.authenticate("jwt", { session: false }), authController.removeController);
router.patch("/cancel-delete", passport.authenticate("jwt", { session: false }), authController.cancelRemoveController);
router.get("/sessions", passport.authenticate("jwt", { session: false }), authController.getSessionsController);
router.delete("/sessions", passport.authenticate("jwt", { session: false }), authController.terminateSessionsController);
router.delete("/sessions/:id", passport.authenticate("jwt", { session: false }), authController.terminateSessionController);
router.patch("/reset-password", authController.resetPasswordController);
router.patch("/change-password", passport.authenticate("jwt", { session: false }), authController.changePasswordController);
router.patch("/refresh", passport.authenticate("jwt", { session: false }), authController.refreshController);

/** OAuth */
router.get("/oauth/google/failure", oauthController.signInOAuthErrorController);
/** Google Sign In */
router.get("/oauth/google", passport.authenticate("google", { scope: ["email", "profile"], session: false }));
router.get(
  "/oauth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/auth/oauth/google/failure", session: false }),
  oauthController.signInGoogleController
);

module.exports = router;

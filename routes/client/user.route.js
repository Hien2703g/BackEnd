const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadClould = require("../../middlewares/client/uploadClould.middlewares");
const controller = require("../../controllers/client/user_controller");
const validate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword);

router.post(
  "/password/forgot",
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);

router.post(
  "/password/reset",
  validate.resetPasswordPost,
  controller.resetPasswordPost
);

router.get("/info", authMiddleware.requireAuth, controller.info);
router.get("/edit", authMiddleware.requireAuth, controller.edit);
router.patch(
  "/edit",
  authMiddleware.requireAuth,
  upload.single("avatar"),
  uploadClould.upload,
  validate.editPatch,
  controller.editPatch
);
module.exports = router;

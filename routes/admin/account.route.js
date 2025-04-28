const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const controller = require("../../controllers/admin/account_controller");
const uploadClould = require("../../middlewares/admin/uploadClould.middlewares");
const validates = require("../../validates/admin/account.validate");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadClould.upload,
  validates.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadClould.upload,
  validates.editPatch,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);

module.exports = router;

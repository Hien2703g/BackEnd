const express = require("express");
const multer = require("multer");

const router = express.Router();
// const storageMulter = require("../../Helper/storageMulter");

// const upload = multer({ storage: storageMulter() });

// import { v2 as cloudinary } from "cloudinary";

// Configuration cloudinary

//End Configuration cloudinary

const upload = multer();

const controller = require("../../controllers/admin/product_controller");
const validates = require("../../validates/admin/product.validate");
const uploadClould = require("../../middlewares/admin/uploadClould.middlewares");
router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadClould.upload,
  validates.createPost,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadClould.upload,
  validates.createPost,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);

module.exports = router;

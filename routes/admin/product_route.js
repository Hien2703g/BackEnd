const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product_controller");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);

module.exports = router;

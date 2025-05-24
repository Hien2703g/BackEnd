const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/order_controller");
router.get("/", controller.index);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/detail/:orderId", controller.detail);
module.exports = router;

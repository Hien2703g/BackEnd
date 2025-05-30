const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/order_controller");
router.get("/", controller.index);
router.get("/detail/:orderId", controller.detail);
module.exports = router;

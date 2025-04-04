const express = require("express");
const route = express.Router();
const controller = require("../../controllers/client/product_controller");

route.get("/", controller.index);
route.get("/:slug", controller.detail);

module.exports = route;

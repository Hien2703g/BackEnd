const express = require("express");
const route = express.Router();
const controller = require("../../controllers/client/product_controller");

route.get("/", controller.index);
route.get("/:slugCategory", controller.category);
route.get("/detail/:slugProduct", controller.detail);
route.get("/review/:slugProduct", controller.review);
route.post("/review/:slugProduct", controller.reviewPost);

module.exports = route;

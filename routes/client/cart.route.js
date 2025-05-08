const express = require("express");
const route = express.Router();
const controller = require("../../controllers/client/cart_controller");
route.post("/add/:productID", controller.addPost);

module.exports = route;

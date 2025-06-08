const express = require("express");
const route = express.Router();
const controller = require("../../controllers/client/userSocial_controller");

route.get("/not-friend", controller.notFriend);

route.get("/request", controller.request);

route.get("/accept", controller.accept);

route.get("/friends", controller.friends);

module.exports = route;

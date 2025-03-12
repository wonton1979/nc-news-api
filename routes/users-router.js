const {getAllUsers,getUserByUsername} = require("../controllers/users.controller");
const express = require("express");
const usersRouter = express.Router();

usersRouter.get("/api/users", getAllUsers);

usersRouter.get("/api/users/:username", getUserByUsername);

module.exports = usersRouter;
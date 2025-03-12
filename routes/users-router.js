const {getAllUsers} = require("../controllers/users.controller");
const express = require("express");
const usersRouter = express.Router();

usersRouter.get("/api/users", getAllUsers);

module.exports = usersRouter;
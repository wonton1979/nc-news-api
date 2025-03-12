const {getApi} = require("../controllers/api.controller");

const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/api", getApi)

module.exports = apiRouter;
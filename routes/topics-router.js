const {getAllTopics} = require("../controllers/topics.controller");
const express = require("express");
const topicsRouter = express.Router();


topicsRouter.get("/api/topics", getAllTopics)

module.exports = topicsRouter;
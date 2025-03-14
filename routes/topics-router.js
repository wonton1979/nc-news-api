const {getAllTopics,postNewTopic} = require("../controllers/topics.controller");
const express = require("express");
const topicsRouter = express.Router();


topicsRouter.get("/api/topics", getAllTopics)
topicsRouter.post("/api/topics", postNewTopic)

module.exports = topicsRouter;
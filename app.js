const express = require("express");
const app = express();
const db = require("./db/connection");
const {getAllTopics} = require("./controllers/topics.controller");
const {getArticleById} = require("./controllers/articles.controller");
const {getApi} = require("./controllers/api.controller");
const {customErrorController,serverErrorController} = require("./controllers/errors.controller");

app.get("/api", getApi)

app.get("/api/topics", getAllTopics)

app.get('/api/articles/:article_id', getArticleById);

app.use(customErrorController);

app.use(serverErrorController);

module.exports = app;
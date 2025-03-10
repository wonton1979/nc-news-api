const express = require("express");
const app = express();
const db = require("./db/connection");
const {getAllTopics} = require("./controllers/topics.controller");
const {getArticleById,getAllArticles} = require("./controllers/articles.controller");
const {getApi} = require("./controllers/api.controller");
const {customErrorController,serverErrorController,psqlErrorController} = require("./controllers/errors.controller");
const {getCommentsByArticleId} = require("./controllers/comments.controller");

app.get("/api", getApi)

app.get("/api/topics", getAllTopics)

app.get('/api/articles/:article_id', getArticleById);

app.get("/api/articles", getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.use(psqlErrorController);

app.use(customErrorController);

app.use(serverErrorController);

module.exports = app;
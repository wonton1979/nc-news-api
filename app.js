const express = require("express");
const app = express();
const db = require("./db/connection");
const topicsRoutes = require("./routes/topics-router");
const articlesRoutes = require("./routes/articles-router");
const {getApi} = require("./controllers/api.controller");
const {customErrorController,serverErrorController,psqlErrorController} = require("./controllers/errors.controller");
const commentsRoutes = require("./routes/comments-rounter");
const usersRoutes = require("./routes/users-router");
const apiRoutes = require("./routes/api-router");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use(apiRoutes);

app.use(topicsRoutes);

app.use(articlesRoutes);

app.use(commentsRoutes);

app.use(usersRoutes);

app.use(psqlErrorController);

app.use(customErrorController);

app.use(serverErrorController);

module.exports = app;
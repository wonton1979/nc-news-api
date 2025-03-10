const express = require("express");
const app = express();
const db = require("./db/connection");
const endpointsJson = require("./endpoints.json");
const {getAllTopics} = require("./controllers/topics.controller");
const {customErrorController,serverErrorController} = require("./controllers/errors.controller");

app.use(express.json());


app.get("/api", (req, res) => {
    res.status(200).send({"endpoints": endpointsJson});
})

app.get("/api/topics", getAllTopics)

app.use(customErrorController);

app.use(serverErrorController);

module.exports = app;
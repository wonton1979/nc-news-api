const {getArticleById, getAllArticles, patchArticleById} = require("../controllers/articles.controller");
const express = require("express");
const articlesRouter = express.Router();


articlesRouter.get("/api/articles", getAllArticles)

articlesRouter
    .route('/api/articles/:article_id')
    .get(getArticleById)
    .patch(patchArticleById);

module.exports = articlesRouter;
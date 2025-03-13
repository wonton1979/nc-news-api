const {getArticleById, getAllArticles, patchArticleById,postNewArticle} = require("../controllers/articles.controller");
const express = require("express");
const articlesRouter = express.Router();


articlesRouter
    .route("/api/articles")
    .get(getAllArticles)
    .post(postNewArticle);

articlesRouter
    .route('/api/articles/:article_id')
    .get(getArticleById)
    .patch(patchArticleById);

module.exports = articlesRouter;
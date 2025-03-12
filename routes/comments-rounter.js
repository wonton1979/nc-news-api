const {
    getCommentsByArticleId,
    postCommentsByArticleId,
    deleteCommentByCommentId
} = require("../controllers/comments.controller");

const express = require("express");
const commentsRouter = express.Router();


commentsRouter
    .route('/api/articles/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentsByArticleId);

commentsRouter.delete("/api/comments/:comment_id",deleteCommentByCommentId);

module.exports = commentsRouter;
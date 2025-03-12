const {
    getCommentsByArticleId,
    postCommentsByArticleId,
    deleteCommentByCommentId,
    patchCommentVotesByCommentId
} = require("../controllers/comments.controller");

const express = require("express");
const commentsRouter = express.Router();


commentsRouter
    .route('/api/articles/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentsByArticleId);

commentsRouter
    .route("/api/comments/:comment_id")
    .delete(deleteCommentByCommentId).patch(patchCommentVotesByCommentId);

module.exports = commentsRouter;
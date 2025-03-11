const {fetchCommentsByArticleId,insertCommentsByArticleId} = require('../models/comments.model')


exports.getCommentsByArticleId = (request, response,next) => {
    const {article_id} = request.params;
    fetchCommentsByArticleId(article_id).then((comments)=>{
        response.status(200).send({comments: comments})
    }).catch((error)=>{
        next(error);
    })
}

exports.postCommentsByArticleId = (request, response, next) => {
    const article_id = request.params.article_id;
    insertCommentsByArticleId(article_id,request.body).then((newComment)=>{
        response.status(201).send({'new_comment': newComment});
    }).catch((error)=>{
        next(error);
    });
}
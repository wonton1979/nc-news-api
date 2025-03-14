const {fetchCommentsByArticleId,insertCommentsByArticleId,dropCommentByCommentId,updateCommentVotesByCommentId} = require('../models/comments.model')


exports.getCommentsByArticleId = (request, response,next) => {
    const {article_id} = request.params;
    fetchCommentsByArticleId(article_id,request.query).then((comments)=>{
        response.status(200).send({comments: comments})
    }).catch((error)=>{
        next(error);
    })
}

exports.postCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params;
    insertCommentsByArticleId(article_id,request.body).then((newComment)=>{
        response.status(201).send({'new_comment': newComment});
    }).catch((error)=>{
        next(error);
    });
}

exports.deleteCommentByCommentId = (request, response,next) => {
    const {comment_id} = request.params;
    dropCommentByCommentId(comment_id).then((comment)=>{
        response.status(204).send()
    }).catch((error)=>{
        next(error);
    })
}

exports.patchCommentVotesByCommentId = (request, response,next) => {
    const {comment_id} = request.params;
    const {inc_votes} = request.body;
    updateCommentVotesByCommentId(comment_id,inc_votes).then((comment)=>{
        response.status(200).send({comment: comment})
    }).catch((error)=>{
        next(error);
    })
}
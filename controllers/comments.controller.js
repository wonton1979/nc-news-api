const {fetchCommentsByArticleId} = require('../models/comments.model')


exports.getCommentsByArticleId = (request, response,next) => {
    const {article_id} = request.params;
    fetchCommentsByArticleId(article_id).then((comments)=>{
        response.status(200).send({comments: comments})
    }).catch((error)=>{
        next(error);
    })
}
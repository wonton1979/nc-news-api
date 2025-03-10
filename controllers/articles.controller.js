const {fetchArticleById,fetchAllArticles} = require('../models/articles.model')


exports.getArticleById = (request, response,next) => {
    const {article_id} = request.params;
    fetchArticleById(article_id).then((article)=>{
        response.status(200).send({article: article})
    }).catch((error)=>{
        next(error);
    })
}

exports.getAllArticles = (request, response, next) => {
    fetchAllArticles(request.query).then((articles)=>{
        response.status(200).send(articles)
    }).catch((error)=>{
        next(error);
    })
}


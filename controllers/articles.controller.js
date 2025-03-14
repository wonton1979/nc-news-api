const {fetchArticleById,fetchAllArticles,updateArticleById,insertNewArticle} = require('../models/articles.model')


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
        response.status(200).send({articles: articles,total_count:articles.length})
    }).catch((error)=>{
        next(error);
    })
}

exports.patchArticleById = (request, response,next) => {
    const {article_id} = request.params;
    const {inc_votes} = request.body;
    updateArticleById(article_id,inc_votes).then((article)=>{
        response.status(200).send({article: article})
    }).catch((error)=>{
        next(error);
    })
}

exports.postNewArticle= (request, response, next) => {
    insertNewArticle(request.body).then((newArticle)=>{
        response.status(201).send({'new_article': newArticle});
    }).catch((error)=>{
        next(error);
    });
}

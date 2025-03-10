const db = require("../db/connection");

exports.fetchArticleById = (articleId) => {
    return db.query("SELECT * from articles where article_id = $1",[articleId]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:404,msg: "Not Found"})
        }
        return rows;
    })
}

exports.fetchAllArticles = () => {
    return db.query(`SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,
                    articles.votes,articles.article_img_url,COUNT(comments.comment_id) AS comment_count
                     FROM articles JOIN comments ON articles.article_id = comments.article_id
                     GROUP BY (articles.article_id) ORDER BY articles.created_at DESC`).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status:404,msg: "Not Found"})
        }
        return rows
    })
}


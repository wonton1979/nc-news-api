const db = require("../db/connection");
const {fetchArticleById} = require("./articles.model");
const {convertTimestampToDate} = require('../db/seeds/utils.js');
const {fetchUserByUsername} = require("./users.model");


exports.fetchCommentsByArticleId = (articleId) => {
    return fetchArticleById(articleId).then((article) => {
        if (article.length !== 0) {
            return db.query("SELECT * from comments where article_id = $1 ORDER BY created_at DESC",[articleId]).then(({rows})=>{
                return rows;
            })
        }
    })
}


exports.insertCommentsByArticleId = (article_id,queryBody) => {
    const {username,body} = queryBody;
    return fetchArticleById(article_id).then((article) => {
        if (article.length !== 0) {
            return fetchUserByUsername(username).then((user) => {
                if (user !== 0) {
                    const createdAt = convertTimestampToDate({created_at:Date.now()})["created_at"]
                    return db.query("INSERT INTO comments (article_id,author,body,created_at,votes) VALUES ($1,$2,$3,$4,$5) RETURNING *",
                        [article_id,username,body,createdAt,0]).then(({rows})=>{
                        return rows[0];
                    })
                }
            })
        }
    })

}

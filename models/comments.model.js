const db = require("../db/connection");
const {fetchArticleById} = require("./articles.model");
const {convertTimestampToDate} = require('../db/seeds/utils.js');
const {fetchUserByUsername} = require("./users.model");

function fetchCommentByCommentId (commentID) {

    return db.query("SELECT * from comments where comment_id = $1",[commentID]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:404,msg: "No comment found with this id."})
        }
        return rows;
    })
}

function fetchCommentsByArticleId (articleId) {
    return fetchArticleById(articleId).then((article) => {
        if (article.length !== 0) {
            return db.query("SELECT * from comments where article_id = $1 ORDER BY created_at DESC",[articleId]).then(({rows})=>{
                return rows;
            })
        }
    })
}


function insertCommentsByArticleId (article_id,queryBody){
    const {username,body} = queryBody;
    if(typeof username !== "string" || typeof body !== "string" ){
        return Promise.reject({status:400,msg: "Bad Request"});
    }
    else{
        return fetchArticleById(article_id).then((article) => {
            if (article.length !== 0) {
                return fetchUserByUsername(username).then(() => {
                    const createdAt = convertTimestampToDate({created_at:Date.now()})["created_at"]
                    return db.query("INSERT INTO comments (article_id,author,body,created_at,votes) VALUES ($1,$2,$3,$4,$5) RETURNING *",
                        [article_id,username,body,createdAt,0]).then(({rows})=>{
                        return rows[0];
                    })
                })
            }
        })
    }
}


function dropCommentByCommentId (commentId) {
    return fetchCommentByCommentId(commentId).then((rows) => {
        return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *",[commentId]).then(({rows})=>{
            return rows;
        })
    })
}



module.exports = {fetchCommentsByArticleId,insertCommentsByArticleId,dropCommentByCommentId};
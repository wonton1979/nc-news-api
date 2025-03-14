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

function fetchCommentsByArticleId (articleId,queryData) {
    return fetchArticleById(articleId).then((article) => {
        if (article.length !== 0) {
            let queryString ="SELECT * from comments where article_id = $1 ORDER BY created_at DESC";
            const valueList = [articleId];
            return db.query(queryString,[articleId]).then(({rows})=>{
                const numbersOfRows = rows.length;
                if(queryData.limit){
                    const numberLimit = Number(queryData.limit);
                    if(!isNaN(numberLimit) && numberLimit > 0){
                        queryString += ` LIMIT $2`;
                        valueList.push(numberLimit);
                        const pages = Math.ceil(numbersOfRows / numberLimit);
                        if(queryData.p){
                            const numberPage = Number(queryData.p);
                            if(!isNaN(numberPage) && numberPage > 0){
                                queryString += ` OFFSET $3`;
                                valueList.push((numberPage-1)*numberLimit);
                                return db.query(queryString,valueList).then(({rows})=> {
                                    return rows;
                                })
                            }
                            else {
                                return Promise.reject({status: 400, msg: 'Bad Request'})
                            }
                        }
                        else {
                            return db.query(queryString,valueList).then(({rows})=> {
                                return rows;
                            })
                        }
                    }
                    else {
                        return Promise.reject({status: 400, msg: 'Bad Request'})
                    }
                }
                else{
                    if(queryData.p){
                        return Promise.reject({status: 400, msg: 'Bad Request'})
                    }
                }
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

function updateCommentVotesByCommentId (commentId,inc_votes){
    return fetchCommentByCommentId(commentId).then((comment)=>{
        const newVotes = comment[0].votes + inc_votes;
        return db.query("UPDATE comments SET votes = $1 where comment_id = $2 RETURNING *",[newVotes,commentId]).then(({rows})=>{
            return rows;
        })
    })
}


module.exports = {fetchCommentsByArticleId,insertCommentsByArticleId,dropCommentByCommentId,updateCommentVotesByCommentId};
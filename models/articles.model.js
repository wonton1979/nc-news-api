const db = require("../db/connection");
const format = require("pg-format");
const {fetchUserByUsername} = require("./users.model");
const {fetchTopicByTopic} = require("./topics.model");


function fetchArticleById (articleId)  {
    return db.query("SELECT articles.*,(SELECT COUNT(*) FROM comments WHERE article_id = $1) AS comment_count FROM articles WHERE article_id = $2",[articleId,articleId]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:404,msg: "No articles found with this id."})
        }
        return rows;
    })
}

function fetchAllArticles (queryData)  {
    if(Object.keys(queryData).length === 0){
        return db.query(`SELECT articles.*,COUNT(comments.comment_id) AS comment_count
                     FROM articles JOIN comments ON articles.article_id = comments.article_id
                     GROUP BY (articles.article_id) ORDER BY articles.created_at DESC`).then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject({status:404,msg: "Not Found"})
            }
            return rows
        })
    }
    else {
        let formattedQuery = ""
        let queryStr = "SELECT * from articles";
        const allowedInput = ['sort_by', 'order', 'article_id','author','title','created_at','votes','article_img_url','body','topic']
        const allowedOrder= ['desc','asc'];
        if(Object.keys(queryData).length === 2 && queryData.sort_by && queryData.order){
            if(!allowedInput.includes(queryData.sort_by) || !allowedOrder.includes(queryData.order.toLowerCase())){
                return Promise.reject({status: 400, msg: 'Bad Request'})
            }
            else {
                queryStr += ' ORDER BY %I %s';
                formattedQuery =format(queryStr,queryData.sort_by,queryData.order)
                return db.query(formattedQuery).then(({rows})=>{
                    return rows;
                })
            }
        }
        else if(Object.keys(queryData).length === 1){
            if(queryData.sort_by){
                queryStr += ' ORDER BY %I';
                formattedQuery =format(queryStr,queryData.sort_by)
                return db.query(formattedQuery).then(({rows})=>{
                    return rows;
                })
            }
            else if(queryData.order){
                queryStr += ' ORDER BY created_at %s';
                formattedQuery =format(queryStr,queryData.order)
                return db.query(formattedQuery).then(({rows})=>{
                    return rows;
                })
            }
            else if(queryData.topic && (queryData.topic != parseInt(queryData.topic))){
                console.log(typeof queryData.topic)
                queryStr += " where topic = '%I'";
                formattedQuery =format(queryStr,queryData.topic)
                return db.query(formattedQuery).then(({rows})=>{
                    return rows;
                })
            }
            else {
                return Promise.reject({status: 400, msg: 'Bad Request'})
            }
        }
        else {
            return Promise.reject({status: 400, msg: 'Bad Request'})
        }
    }
}

function updateArticleById (articleId,inc_votes){
    return fetchArticleById(articleId).then((article)=>{
        const newVotes = article[0].votes + inc_votes;
        return db.query("UPDATE articles SET votes = $1 where article_id = $2 RETURNING *",[newVotes,articleId]).then(({rows})=>{
            return rows;
        })
    })
}

function insertNewArticle(queryBody) {
    const {author, title, body, topic,article_img_url} = queryBody;
    const greenList = ["author", "title", "body", "topic", "article_img_url"]
    if (Object.keys(queryBody).some(key => !greenList.includes(key))) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    console.log("here");  // This won't log if rejection occurs

    return fetchUserByUsername(author).then(({rows})=>{
        return fetchTopicByTopic(topic).then(({rows})=>{
            if(!article_img_url){
                return db.query("INSERT INTO articles (author,title,body,topic) VALUES ($1,$2,$3,$4) RETURNING *",
                    [author, title, body, topic]).then(({rows}) => {
                    return fetchArticleById(rows[0].article_id).then((article) => {
                        return article;
                    })
                })
            }
            else {
                return db.query("INSERT INTO articles (author,title,body,topic,article_img_url) VALUES ($1,$2,$3,$4) RETURNING *",
                    [author, title, body, topic,article_img_url]).then(({rows}) => {
                    return fetchArticleById(rows[0].article_id).then((article) => {
                        return article;
                    })
                })
            }
        })
    })

}

module.exports = {fetchArticleById,fetchAllArticles,updateArticleById,insertNewArticle};
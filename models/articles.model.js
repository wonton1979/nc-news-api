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
        return db.query(`SELECT articles.*, COALESCE(COUNT(comments.comment_id),0) AS comment_count
                     FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
                     GROUP BY (articles.article_id) ORDER BY articles.created_at DESC`).then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject({status:404,msg: "Not Found"})
            }
            return rows
        })
    }
    else {
        if(queryData.votes){
            const votesInNumber = Number(queryData.votes);
            if(isNaN(votesInNumber) || votesInNumber < 0){
                return Promise.reject({status: 400, msg: 'Bad Request'})
            }
        }
        if(queryData.topic){
            if(!isNaN(Number(queryData.topic))) {
                return Promise.reject({status: 400, msg: 'Bad Request'})
            }
        }
        const propertyQueryAllowed = ['article_id','author','title','created_at','votes','article_img_url','body','topic'];
        let queryStr = "SELECT * FROM articles";
        const valueList = [];
        let valuesCounter = 0;
        const propertyQueryList = propertyQueryAllowed.filter((eachProperty)=>{
            if(Object.keys(queryData).includes(eachProperty)){
                return eachProperty;
            }
        })
        if(propertyQueryList.length !== 0){
            valuesCounter += 1;
            queryStr += ` WHERE ${propertyQueryList[0]} = $${valuesCounter}`;
            valueList.push(queryData[propertyQueryList[0]])
            if(propertyQueryAllowed.length > 1){
                for(let i= 1; i<propertyQueryList.length; i++){
                    valuesCounter += 1;
                    queryStr += ` and ${propertyQueryList[i]} = $${valuesCounter}`;
                    valueList.push(queryData[propertyQueryList[i]]);
                }
            }
        }

        if(queryData.sort_by){
            if(propertyQueryAllowed.includes(queryData.sort_by)){
                queryStr += ` ORDER BY %I`;
                queryStr = format(queryStr,queryData.sort_by);
                if(queryData.order){
                    if(["desc","asc"].includes(queryData.order.toLowerCase())){
                        queryStr += ` %s`;
                        queryStr = format(queryStr,queryData.order);
                    }
                    else {
                        return Promise.reject({status: 400, msg: 'Bad Request'})
                    }
                }
            }
            else {
                return Promise.reject({status: 400, msg: 'Bad Request'})
            }
        }
        else {
            if(queryData.order){
                if(["desc","asc"].includes(queryData.order.toLowerCase())){
                    queryStr += ` ORDER BY created_at %s`;
                    queryStr = format(queryStr,queryData.order);
                }
                else {
                    return Promise.reject({status: 400, msg: 'Bad Request'})
                }
            }
            else {
                queryStr += ` ORDER BY created_at DESC`;
            }
        }

        return db.query(queryStr,valueList).then(({rows})=> {
            const numbersOfRows = rows.length;
            if(queryData.limit){
                const numberLimit = Number(queryData.limit);
                if(!isNaN(numberLimit) && numberLimit > 0){
                    if(valuesCounter > 0){
                        valuesCounter += 1;
                    }
                    else {
                        valuesCounter = 1;
                    }
                    queryStr += ` LIMIT $${valuesCounter}`;
                    valueList.push(numberLimit);
                    const pages = Math.ceil(numbersOfRows / numberLimit);
                    if(queryData.p){
                        const numberPage = Number(queryData.p);
                        if(!isNaN(numberPage) && numberPage > 0){
                            valuesCounter += 1;
                            queryStr += ` OFFSET $${valuesCounter}`;
                            valueList.push((numberPage-1)*numberLimit);
                            return db.query(queryStr,valueList).then(({rows})=> {
                                return rows;
                            })
                        }
                        else {
                            return Promise.reject({status: 400, msg: 'Bad Request'})
                        }
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
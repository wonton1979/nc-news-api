const db = require("../db/connection");

exports.fetchArticleById = (articleId) => {
    return db.query("SELECT * from articles where article_id = $1",[articleId]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:404,msg: "Not Found"})
        }
        return rows;
    })
}


const db = require('../db/connection')

function fetchAllTopics() {
    return db.query(`SELECT * FROM topics`)
        .then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject({status:404,msg: "Not Found"})
            }
            return rows;
        })
}

function fetchTopicByTopic (topic) {
    return db.query("SELECT * from topics where slug = $1",[topic]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status:404,msg: "The topic(slug) does not exist."})
        }
        return rows;
    })
}

function insertNewTopic(queryBody) {
    const {slug, description} = queryBody;
    if (!isNaN(Number(slug)) || !isNaN(Number(description))) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    } else {
        return db.query("SELECT * from topics where slug = $1",[slug]).then(({rows})=>{
            if(rows.length === 0){
                return db.query("INSERT INTO topics (slug,description,img_url) VALUES ($1,$2,$3) RETURNING *",
                    [slug, description,""]).then(({rows}) => {
                    return rows;
                })
            }
            else {
                return Promise.reject({status: 400, msg: "This topic already exist"});
            }
        })
    }
}

module.exports = {fetchAllTopics,fetchTopicByTopic,insertNewTopic};
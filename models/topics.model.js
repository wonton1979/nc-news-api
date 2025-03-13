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

module.exports = {fetchAllTopics,fetchTopicByTopic};
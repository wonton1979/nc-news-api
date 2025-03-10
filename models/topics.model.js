const db = require('../db/connection')

function fetchAllTopics(request, response) {
    return db.query(`SELECT * FROM topics`)
        .then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject({status:404,msg: "Not Found"})
            }
            return rows;
        })
}

module.exports = {fetchAllTopics};
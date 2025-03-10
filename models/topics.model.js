const db = require('../db/connection')

function fetchAllTopics(request, response) {
    return db.query(`SELECT * FROM topics`)
        .then(rows => {
            data = rows.rows;
            return data;
        })
}

module.exports = {fetchAllTopics};
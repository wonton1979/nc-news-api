const {fetchAllTopics} = require("../models/topics.model")

function getAllTopics(request, response, next) {
    fetchAllTopics().then((data) => {
        response.status(200).send({ topics: data });
    }).catch(error => {
        next(error)
    });
}


module.exports = { getAllTopics};